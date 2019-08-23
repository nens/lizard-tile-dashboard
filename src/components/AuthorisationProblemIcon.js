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
      keyErrorPairs.map(item=>item + ' \n ')
    );
  }

  render () {

   
    console.log('AuthorisationProblemIcon this.props.timeseries', this.props.timeseriesMetadata, this.props.timeseries, this.props.timeseriesEvents)
    
    const rasterKeys = Object.keys(this.props.rasters.metadata);
    const errorKeys = rasterKeys.filter(key=> this.props.rasters.metadata[key].error !== null);
    // const keyErrorPairs = errorKeys.map(key=> key + ' : ' + this.props.rasters.metadata[key].error)
    // console.log('keyErrorPairs', keyErrorPairs)
    const keyErrorPairs = [1]


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
    timeseriesMetadata: state.timeseries,
    // from TimeseriesChart
    measuringstations: state.assets.measuringstation || {},
    timeseries: state.timeseries,
    rasterEvents: state.rasterEvents,
    timeseriesEvents: state.timeseriesEvents,
    alarms: state.alarms,
  };
}

export default withRouter(
  connect(mapStateToProps)(AuthorisationProblemIcon)
);
