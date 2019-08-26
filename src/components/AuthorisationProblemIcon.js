import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getReferenceLevels,
  getAllTiles,
  getConfiguredMapBackgrounds,
  getCurrentMapBackground,
  getConfiguredPortalBBox
} from "../reducers";
import { withRouter } from "react-router-dom";
import styles from "./AuthorisationProblemIcon.css";

class AuthorisationProblemIcon extends Component {
  
  constructor(props) {
    super(props);
    this.state = {}
  }

  showAuthorisationProblems (keyErrorPairs) {
    alert (
      'the following resources were not found: \n ' +
      (keyErrorPairs.map(item=>item + ' \n ').join(''))
    );
  }

  getKeyErrorPairs () {
    const rasterKeys = (this.props.rasters.metadata && this.transformMetadataToKeyErrorPairs(this.props.rasters.metadata)) || [];
    const timeseriesKeys = (this.props.timeseries.metadata && this.transformMetadataToKeyErrorPairs(this.props.timeseries.metadata)) || [];
    return rasterKeys.concat(timeseriesKeys);
  }

  transformMetadataToKeyErrorPairs (metadata) {
    const keys = Object.keys(metadata);
    const errorKeys = keys.filter(key=> metadata[key].error !== null);
    const keyErrorPairs = errorKeys.map(key=> key + ' : ' + metadata[key].error);
    return keyErrorPairs;
  }

  render () {

   
    console.log('AuthorisationProblemIcon this.props.timeseries', this.props.timeseriesMetadata, this.props.timeseries, this.props.timeseriesEvents)
    const keyErrorPairs = this.getKeyErrorPairs();
    
    // const keyErrorPairs = [1]
    // console.log('keyErrorPairs', keyErrorPairs)


    return (
        <span>
          {
            keyErrorPairs.length !== 0 ? 
            <i 
              className={"material-icons"+ " " + styles.Icon}
              title="You appear to be unauthorised for some data. Click to show which!"
              onClick={e=>this.showAuthorisationProblems(keyErrorPairs)} 
            >
              lock
              &nbsp;
            </i>
            :
            null
          }
        </span>
    );
  }

}

function mapStateToProps(state) {
  return {
    // from map
    assets: state.assets,
    rasters: state.rasters,
    alarms: state.alarms,
    timeseriesMetadata: state.timeseries.metadata,
    // timeseriesMetadata: state.timeseries,
    // from TimeseriesChart
    measuringstations: state.assets.measuringstation || {},
    timeseries: state.timeseries.data,
    rasterEvents: state.rasterEvents,
    timeseriesEvents: state.timeseriesEvents,
    alarms: state.alarms,
  };
}

export default withRouter(
  connect(mapStateToProps)(AuthorisationProblemIcon)
);
