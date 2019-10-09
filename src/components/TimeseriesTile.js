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
    width: null,
    height: null
  }

  // componentDidMount() {
  //   if (this.props.isFull) {
  //     this.setState({
  //       width: window.innerWidth,
  //       height: window.innerHeight
  //     })
  //   }
  //   if (!this.props.isFull && this.theDiv) {
  //     this.setState({
  //       width: this.theDiv.clientWidth,
  //       height: this.theDiv.clientHeight
  //     })
  //   }
  // }

  // shouldComponentUpdate(nextState) {
  //   const { width, height } = this.state;

  //   if (width !== nextState.width) return true;
  //   if (height !== nextState.height) return true;
  // }

  componentWillMount() {
    // if (this.props.isFull) {
    //   this.setState({
    //     width: window.innerWidth,
    //     height: window.innerHeight
    //   })
    // }
    // if (!this.props.isFull && this.theDiv) {
    //   this.setState({
    //     width: this.theDiv.clientWidth,
    //     height: this.theDiv.clientHeight
    //   })
    // }
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

    console.log(width, height)
    // console.log(this.theDiv)

    // if (this.props.tile.id === 27) {
    //   console.log(this)
    //   console.log(this.theDiv)
    // }

    if (!width && !height) {
      if (this.props.isFull) {
        this.setState({
          width: window.innerWidth,
          height: window.innerHeight
        })
      } 
      if (!this.props.isFull && this.theDiv) {
        this.setState({
          width: this.theDiv.clientWidth,
          height: this.theDiv.clientHeight
        })
      }
    }

    // console.log(width, height)

    // if (this.props.tile.id === 27) {
    //   console.log(this)
    //   console.log(this.theDiv)
    //   setTimeout(() => {
    //     console.log(this.theDiv && this.theDiv.clientHeight)
    //   }, 100)
    //   // console.log(JSON.stringify(this.theDiv))
    //   // console.log(this.theDiv && this.theDiv.clientWidth, this.theDiv && this.theDiv.clientHeight)
    //   // console.log('width height: ', width, height)
    // }

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
