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
    return (
      window.location.href.split("dashboard/")[1] &&
      window.location.href.split("dashboard/")[1].split("/")[0]
    );
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
