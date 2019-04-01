import React, { Component } from "react";
// import ReactDOM from "react-dom"; re-anbale for Plot hack??
import { connect } from "react-redux";
import {
  addAsset,
  getRasterEvents,
  getTimeseriesEvents,
  fetchRaster
} from "../actions";
import { MAX_TIMESERIES_POINTS } from "../config";
import { getBootstrap, getNow, getCurrentPeriod } from "../reducers";

import { makeGetter } from "lizard-api-client";
import plotComponentFactory from "react-plotly.js/factory";

import {
  axisLabel,
  indexForType,
  combineEventSeries
} from "./TimeseriesChartUtils.js";

const Plot = plotComponentFactory(window.Plotly);

class PlotlyChartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      componentHasMountedOnce: false,
      componentRef: "comp-" + parseInt(Math.random(), 10),
      combinedEvents: null
    };
  }

  componentWillMount() {
    this.updateTimeseries();
  }

  updateTimeseries() {
    (this.props.tile.timeseries || []).map(uuid =>
      this.props.getTimeseriesEvents(uuid, this.props.start, this.props.end, {
        minpoints: MAX_TIMESERIES_POINTS
      })
    );

    (this.props.tile.rasterIntersections || []).map(intersection =>
      this.props.getRasterEvents(
        this.props.getRaster(intersection.uuid).object,
        intersection.geometry,
        this.props.start,
        this.props.end
      )
    );
  }

  allUuids() {
    // Return UUIDs of all timeseries plus those of all rasters
    return (this.props.tile.timeseries || []).concat(
      (this.props.tile.rasterIntersections || []).map(
        intersection => intersection.uuid
      )
    );
  }

  observationType(uuid) {
    if (
      this.props.tile.timeseries &&
      this.props.tile.timeseries.indexOf(uuid) !== -1
    ) {
      // It's a timeseries.
      if (this.props.timeseries[uuid]) {
        return this.props.timeseries[uuid].observation_type;
      } else {
        return null;
      }
    } else {
      // It's a raster.
      const raster = this.props.getRaster(uuid).object;
      return raster ? raster.observation_type : null;
    }
  }

  isRelevantTimeseriesAlarm(alarm) {
    const { tile } = this.props;

    return (
      alarm.isTimeseriesAlarm() &&
      tile.timeseries.indexOf(alarm.timeseries.uuid) !== -1
    );
  }

  isRelevantRasterAlarm(alarm) {
    const { tile } = this.props;

    if (!tile.rasterIntersections) return false;

    return (
      !alarm.isTimeseriesAlarm() &&
      tile.rasterIntersections.some(rasterIntersection => {
        const raster = this.props.getRaster(rasterIntersection.uuid).object;
        return (
          raster &&
          alarm.sameIntersection(raster.url, rasterIntersection.geometry)
        );
      })
    );
  }

  getRasterEvents(raster, geometry) {
    const allEvents = this.props.rasterEvents;
    const geomKey = `${geometry.coordinates[0]}-${geometry.coordinates[1]}`;

    if (allEvents[raster.uuid] && allEvents[raster.uuid][geomKey]) {
      const events = allEvents[raster.uuid][geomKey];
      if (events.start === this.props.start && events.end === this.props.end) {
        return events.events;
      }
    }
    return null;
  }

  render() {
    const timeseriesEvents = (this.props.tile.data || [])
      .filter(
        data =>
          data.xy &&
          data.xy.uuid &&
          this.props.timeseries[data.xy.uuid] &&
          this.props.timeseriesEvents[data.xy.uuid] &&
          this.props.timeseriesEvents[data.xy.uuid].events
      )
      .map(data => {
        const uuid = data.xy.uuid;
        return {
          uuid: uuid,
          observation_type: this.props.timeseries[uuid].observation_type,
          events: this.props.timeseriesEvents[uuid].events
        };
      });

    const preppedTimeseriesEvents = timeseriesEvents.map((serie, idx) => {
      const events = {
        x: serie.events.map(event => new Date(event.timestamp)),
        y: serie.events
          .map(event => (event.hasOwnProperty("max") ? event.max : event.sum))
          .map(value => value && value.toFixed(2))
      };
      return events;
    });

    return (
      <div
        id={this.state.componentRef}
        ref={this.state.componentRef}
        style={{
          marginTop: this.props.marginTop,
          marginLeft: this.props.marginLeft,
          width: this.props.width,
          height: this.props.height
        }}
      >
        <Plot
          data={preppedTimeseriesEvents}
          layout={{
            autosize: true,
            title: "A Fancy Plot"
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: true
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const currentPeriod = getCurrentPeriod(state, ownProps.tile);

  return {
    measuringstations: state.assets.measuringstation || {},
    getRaster: makeGetter(state.rasters),
    timeseries: state.timeseries,
    rasterEvents: state.rasterEvents,
    timeseriesEvents: state.timeseriesEvents,
    alarms: state.alarms,
    now: getNow(state, ownProps.tile),
    start: currentPeriod.start,
    end: currentPeriod.end,
    bootstrap: getBootstrap(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAsset: (assetType, id, instance) =>
      dispatch(addAsset(assetType, id, instance)),
    fetchRaster: uuid => fetchRaster(dispatch, uuid),
    getTimeseriesEvents: (uuid, start, end) =>
      dispatch(getTimeseriesEvents(uuid, start, end)),
    getRasterEvents: (raster, geometry, start, end) =>
      dispatch(getRasterEvents(raster, geometry, start, end))
  };
}

const PlotlyChart = connect(mapStateToProps, mapDispatchToProps)(
  PlotlyChartComponent
);

export default PlotlyChart;
