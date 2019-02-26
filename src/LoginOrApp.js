// First a user has to check a checkbox on the Terms & Conditions screen,
// then he logs in if necessary, then the actual app is shown. This component
// models that workflow.

import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import App from "./App";
import styles from "./App.css";
import { fetchBootstrap } from "./actions";

class LoginOrAppComponent extends Component {
  constructor() {
    super();
    this.state = {}; // Keep it here because we'll probably use it later on.
  }

  componentDidMount() {
    const dashboardName = this.getDashboardName();
    this.props.fetchBootstrap(this.props.sessionState, dashboardName);
  }

  getDashboardName = () => {
    // gets dashboard name from url as defined in /admin/lizard_nxt/clientconfiguration/ "client slug" field
    // the url should be in format of /dashboard/<dashboard_name>/

    // if no dashboard name is given this function should return undefined
    // this is required to create the basename of the JSX Router component (see in this file)

    //  if a dashboard name of undefined is returned then the default name 'dashboard' will be used by function getBootstrap (in file actions.js).
    // when no dashboard is in the url at all this function should return undefined. this should only be the case on dev

    // if dashboardname = 'full' we assume it is not really the dashboardname but the url path to a full tile
    // this rule should ensures that the url /dashboard/full/ returns  undefined

    // examples:
    // /dashboard/my_name/ -> my_name
    // /dashboard/my_name -> my_name
    // /dashboard/dashboard/ -> dashboard
    // /dashboard/dashboard -> dashboard
    // /dashboard/full/1 -> undefined
    // /dashboard/ -> undefined
    // /dashboard -> undefined
    // / -> undefined

    // split on /dashboard/
    // slashes are included in split so we do not also split on the second dashboard in /dashboard/dashboard
    const urlPostDashboard = window.location.href.split("/dashboard/")[1];
    // if there was no /dashboard/ in the url, should only happen in dev or with a url of /dashboard (no tailing slash)
    if (!urlPostDashboard) {
      return undefined;
    }
    const dashboardName = urlPostDashboard.split("/")[0];
    // if dashboardname = 'full' we assume it is not really the dashboardname but the url path to a full tile
    // this rule should ensures that the url /dashboard/full/ returns  undefined
    if (dashboardName === "full") {
      return undefined;
    } else if (dashboardName === "") {
      // if dashboardname = '' then we assume that no dashboard name is given and we return undefined which will resolve to the default
      return undefined;
    } else {
      return dashboardName;
    }
  };

  hasBootstrap() {
    const session = this.props.sessionState;
    const result = !!(session && session.hasBootstrap && session.bootstrap);
    return result;
  }

  render() {
    const dashboardName = this.getDashboardName();

    const basename = dashboardName
      ? "/dashboard/" + dashboardName
      : "/dashboard";

    if (!this.hasBootstrap()) {
      return (
        <div className={styles.LoadingIndicator}>
          <MDSpinner size={24} />
        </div>
      );
    } else if (!this.props.sessionState.bootstrap.authenticated) {
      this.props.sessionState.bootstrap.doLogin();
    } else {
      return (
        <Router basename={basename}>
          <App />
        </Router>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    sessionState: state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBootstrap: (sessionState, dashboardName) =>
      fetchBootstrap(dispatch, sessionState, dashboardName)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  LoginOrAppComponent
);
