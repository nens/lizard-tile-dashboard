import React, { Component } from "react";
import GridLayout from "./components/GridLayout";
import FullLayout from "./components/FullLayout";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import logo_Lizard from "./graphics/logo-Lizard.png";
import { Image } from "react-bootstrap";

import { fetchAlarms } from "./actions";
import styles from "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.fetchAlarms();
  }

  render() {
    return (
      <div className={styles.App}>
        <Route exact path="/" component={GridLayout} />
        <Route exact path="/full/:id" component={FullLayout} />
        <div className="container" id="footer">
          <div className={styles.logoContainer}>
            <a href={"https://www.lizard.net/"}>
              <span className={styles.logoContainerSpan}>
                Powered by Lizard
              </span>
              <span className={styles.logoContainerSpan}> </span>
              <span className={styles.logoContainerSpan}>
                <Image
                  src={logo_Lizard}
                  className={styles.logo}
                  responsive
                  title="Lizard"
                  style={{ margin: "auto" }}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAlarms: () => fetchAlarms(dispatch)
  };
}

export default withRouter(connect(null, mapDispatchToProps)(App));
