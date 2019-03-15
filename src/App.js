import React, { Component } from "react";
import GridLayout from "./components/GridLayout";
import FullLayout from "./components/FullLayout";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";

import { fetchAlarms, setNowAction } from "./actions";
import { getNow } from "./reducers";
import styles from "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    // Every minute, the "now" of the whole app is updated
    setInterval(this.props.setNowAction, 60000);

    // Alarms are used by multiple tiles so we fetch them from here.
    this.props.fetchAlarms();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.now !== this.props.now) {
      this.props.fetchAlarms();
    }
  }

  render() {
    return (
      <div className={styles.App}>
        <Route exact path="/" component={GridLayout} />
        <Route exact path="/full/:id" component={FullLayout} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    now: getNow(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAlarms: () => fetchAlarms(dispatch),
    setNowAction: setNowAction(dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
