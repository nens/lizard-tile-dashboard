import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAlarms } from "../actions";
import {
  IconActiveAlarmSVG,
  IconNoAlarmSVG
} from "./Icons";
import styles from "./FullStatistics.css";

class FullStatistics extends Component {
  componentDidMount() {
    this.props.fetchAlarms();
  }
  getDatetimeString(utcRep) {
    if (utcRep === null) {
      return null;
    } else {
      const d = new Date(utcRep);
      return d.toLocaleString();
    }
  }
  getAlarmsTable() {
    const { alarms } = this.props;
    const alarmsSortedByName = alarms.data
      ? alarms.data.slice().sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      : [];
    const alarmRows = alarmsSortedByName.map((alarm, i) => {
      return (
        <tr key={i}>
          <td>
            {alarm.warning_threshold !== null ? (
              IconActiveAlarmSVG
            ) : (
              IconNoAlarmSVG
            )}
          </td>
          <td>{alarm.name}</td>
          <td>
            {alarm.warning_threshold !== null
              ? alarm.warning_threshold.warning_level
              : null}
          </td>
          <td>{alarm.warning_value ? alarm.warning_value : null}</td>
          <td>{this.getDatetimeString(alarm.warning_timestamp)}</td>
        </tr>
      );
    });
    return (
      <table className={styles.Table}>
        <thead>
          <tr>
            <td>&nbsp;</td>
            <td>Alarm name</td>
            <td>Level</td>
            <td>Value</td>
            <td>Triggered at</td>
          </tr>
        </thead>
        <tbody>{alarmRows}</tbody>
      </table>
    );
  }
  render() {
    const { height, isMobile, alarms } = this.props;
    const numberOfAlarms = alarms.data ? alarms.data.length : 0;
    return (
      <div
        className={styles.FullStatistics}
        style={{ 
          height, 
          paddingLeft: isMobile ? 0 : 200, 
          overflowY: "auto", 
          // we need this as soon as someone complains over the horizontal scroll, but it might break things
          // https://github.com/nens/lizard-tile-dashboard/issues/183
          // overflowX: hidden, 
        }}
      >
        <div
          style={{
            position: "relative",
            top: 60,
            left: 20,
            width: "100%"
          }}
        >
          <div className={styles.Title}>
            All configured alarms ({numberOfAlarms})
          </div>
          {this.getAlarmsTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    alarms: state.alarms
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAlarms: () => fetchAlarms(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullStatistics);
