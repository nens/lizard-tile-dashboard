import React, { Component } from "react";
import { connect } from "react-redux";
import TimeseriesChart from "./TimeseriesChart";
import { makeGetter, getOrFetch } from "../api_client/index";
import { getTimeseriesMetadataAction, fetchRaster } from "../actions";

// Wrapper for TimeseriesChart.

// The TimeseriesTile fetches the assets, timeseries objects and alarms
// that the TimeseriesChart uses; then, when all are present, it renders
// a TimeseriesChart (which fetches the actual timeseries events).
// This is a fix for various "do-this-async-first-then-that-async" issues.

class TimeseriesTileComponent extends Component {
  state = {
    width: 0,
    height: 0,
    fetch: false,
  }

  componentDidMount() {
    if (this.props.isFull) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    } else if (this.theDiv) {
      this.setState({
        width: this.theDiv.clientWidth,
        height: this.theDiv.clientHeight,
        fetch: true
      })
    };
  }

  componentWillMount() {
    (this.props.tile.timeseries || []).map(
      this.props.getTimeseriesMetadataAction
    );

    (this.props.tile.rasterIntersections || []).map(intersection => {
      return getOrFetch(
        this.props.getRaster,
        this.props.fetchRaster,
        intersection.uuid
      );
    });
  }
  // Fix for tile not being updated when switching between tiles after a F5
  componentWillUpdate(nextProps) {
    if (!this.props.isFull && !this.state.fetch && this.theDiv && this.state.width !== this.theDiv.clientWidth) {
      this.setState({
        fetch: true,
        width: this.theDiv.clientWidth,
        height: this.theDiv.clientHeight
      });
    };
    if (nextProps.tile.title !== this.props.tile.title) {
      (nextProps.tile.timeseries || []).map(
        nextProps.getTimeseriesMetadataAction
      );
    };
  }

  timeseries() {
    return this.props.tile.timeseries || [];
  }

  rasters() {
    return (this.props.tile.rasterIntersections || []).map(
      intersection => intersection.uuid
    );
  }

  allAssetsPresent() {
    return (
      this.timeseries().every(this.props.getTimeseriesMetadata) &&
      this.rasters().every(uuid => this.props.getRaster(uuid).object)
    );
  }

  render() {
    const { width, height } = this.state;

    if (this.allAssetsPresent()) {
      const newProps = {
        ...this.props,
        width: width - (this.props.marginLeft? this.props.marginLeft: 0) ,
        height: height - (this.props.marginTop? this.props.marginTop: 0)
      };

      return (
        <div
          ref={theDiv => (this.theDiv = theDiv)}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <TimeseriesChart {...newProps} />
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    rasters: state.rasters,
    getTimeseriesMetadata: uuid => state.timeseries[uuid],
    getRaster: makeGetter(state.rasters)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRaster: uuid => fetchRaster(dispatch, uuid),
    getTimeseriesMetadataAction: uuid =>
      dispatch(getTimeseriesMetadataAction(uuid))
  };
}

const TimeseriesTile = connect(mapStateToProps, mapDispatchToProps)(
  TimeseriesTileComponent
);

export default TimeseriesTile;
