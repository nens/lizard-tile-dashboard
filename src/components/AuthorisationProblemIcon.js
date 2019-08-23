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

  render () {

    // const allUnfoundRasters = this.props.rasters.metadata.filter(raster=>raster.meta.error !== null);
    // const allUnfoundRasters = [1];
    // console.log('AuthorisationProblemIcon this.props.rasters', this.props.rasters)
    
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
    assets: state.assets,
    rasters: state.rasters,
    alarms: state.alarms,
    timeseriesMetadata: state.timeseries,
    allTiles: getAllTiles(state),
    mapBackground: (s => {
      const current = getCurrentMapBackground(s);
      if (current) {
        return current;
      } else {
        return getConfiguredMapBackgrounds(state)[0];
      }
    })(state),
    referenceLevels: getReferenceLevels(state),
    portalBBox: getConfiguredPortalBBox(state)
  };
}

export default withRouter(
  connect(mapStateToProps)(AuthorisationProblemIcon)
);
