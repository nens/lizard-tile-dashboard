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
  // Add state in TimeseriesTileComponent and use lifecycle methods 
  // (componentDidMount and componentWillUpdate) to update tile size
  state = {
    width: 0,
    height: 0,
    tileSizeIsAvailable: false,
    // Boolean value to check if the height and width of the tile
    // have been defined. If not, then set the height and width in
    // componentWillUpdate with the values coming from theDiv ref
  }

  componentDidMount() {
    if (this.props.isFull) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
        tileSizeIsAvailable: true
      })
    } else if (this.theDiv) {
      this.setState({
        width: this.theDiv.clientWidth,
        height: this.theDiv.clientHeight,
        tileSizeIsAvailable: true
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
  
  componentWillUpdate(nextProps) {
    // Fix for tile not being visible after clicking on Go Back from the full view
    if (!this.props.isFull && !this.state.tileSizeIsAvailable && this.theDiv && this.state.width !== this.theDiv.clientWidth) {
      this.setState({
        tileSizeIsAvailable: true,
        width: this.theDiv.clientWidth,
        height: this.theDiv.clientHeight
      });
    };
    // Fix for tile not being updated when switching between tiles after a F5
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
