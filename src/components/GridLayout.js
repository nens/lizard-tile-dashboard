import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import { connect } from "react-redux";
import ReactGridLayout from "react-grid-layout";
import Tile from "./Tile";
import Ink from "react-ink";
import { withRouter } from "react-router-dom";
import TimeseriesTile from "./TimeseriesTile";
import StatisticsTile from "./StatisticsTile";
import ExternalTile from "./ExternalTile";
import Map from "./Map";

import styles from "./GridLayout.css";
import {
  getAllTiles,
  getConfiguredDate,
  getConfiguredTime,
  getConfiguredTitle,
  getConfiguredLogoPath,
  getConfiguredMapBackgrounds,
  getCurrentMapBackground,
  getConfiguredColumnCount,
  getConfiguredTileHeaderColors
} from "../reducers";
import {
  setDateAction,
  setTimeAction,
  resetDateTimeAction,
  setMapBackgroundAction
} from "../actions";

class GridLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canMove: false,
      layout: null,
      width: window.innerWidth,
      height: window.innerHeight,
      settingsMenu: false,
      settingsMenuId: 0
    };
    this.handleUpdateDimensions = this.handleUpdateDimensions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentWillMount() {
    const { columnCount } = this.props;
    if (!this.state.layout) {
      this.setState({
        mobileLayout: this.props.tiles.map((tile, i) => {
          const Y = 8;
          return {
            i: `${i}`,
            x: 0,
            y: i * 8,
            w: 12,
            h: Y,
            minW: 2,
            maxW: 12
          };
        }),
        layout: this.props.tiles.map((tile, i) => {
          const W = Math.floor(12 / columnCount);
          const H = 8;
          return {
            i: `${i}`,
            x: (i * W) % (columnCount * W),
            y: (i % columnCount) * H,
            w: W,
            h: H,
            minW: 2,
            maxW: W
          };
        })
      });
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleUpdateDimensions, false);
    document.addEventListener("keydown", this.handleKeyPress, false);
  }
  componentWillUnMount() {
    window.removeEventListener("resize", this.handleUpdateDimensions, false);
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }
  handleKeyPress(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      this.setState({
        settingsMenu: false
      });
    }
  }
  handleUpdateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  toggleMapBackground() {
    const available = this.props.availableMapBackgrounds;
    const current = this.props.currentMapBackground || available[0];

    if (current.url === available[1].url) {
      this.props.setMapBackground(available[0]);
    } else {
      this.props.setMapBackground(available[1]);
    }
  }

  getLayout() {
    return this.state.width < 700 ? this.state.mobileLayout : this.state.layout;
  }

  render() {
    const { width, height, canMove, settingsMenu, settingsMenuId } = this.state;

    const { tiles, history, title, logoPath } = this.props;

    const mapBackgrounds = this.props.availableMapBackgrounds;

    const nensMail = () => unescape("servicedesk%40nelen%2Dschuurmans%2Enl");

    if (settingsMenu) {
      return (
        <DocumentTitle title={title + " | Settings"}>
          <div className={styles.SettingsMenu} style={{ height: height }}>
            <img
              src={logoPath}
              alt="Rijkswaterstaat logo"
              className={styles.HeaderImage}
            />
            <div
              className={styles.CloseSettings}
              onClick={() => this.setState({ settingsMenu: false })}
            >
              <i className="material-icons">close</i>
            </div>

            <div className={styles.SettingsInner}>
              <nav style={{ height: height - 100 }}>
                <div
                  onClick={() =>
                    this.setState({
                      settingsMenuId: 0
                    })}
                >
                  <i className="material-icons">access_time</i>
                  <span
                    className={`${settingsMenuId === 0
                      ? styles.ActiveMenu
                      : null}`}
                  >
                    Date/Time settings
                  </span>
                </div>

                <div
                  onClick={() =>
                    this.setState({
                      settingsMenuId: 1
                    })}
                >
                  <i className="material-icons">layers</i>
                  <span
                    className={`${settingsMenuId === 1
                      ? styles.ActiveMenu
                      : null}`}
                  >
                    Background layers
                  </span>
                </div>

                <div
                  className={styles.ContactInfoLogoParent}
                  onClick={() =>
                    this.setState({
                      settingsMenuId: 2
                    })}
                >
                  <i className={styles.ContactInfoLogo}>&copy;</i>
                  <span
                    className={`${settingsMenuId === 2
                      ? styles.ActiveMenu
                      : null}`}
                  >
                    Contact
                  </span>
                </div>
              </nav>
              <main style={{ height: height - 100 }}>
                {settingsMenuId === 0 ? (
                  <div>
                    <h4 style={{ padding: 0, margin: 0 }}>
                      Date/time settings &nbsp;
                      <button onClick={this.props.resetDateTime}>Reset</button>
                    </h4>
                    <hr />
                    <div className={styles.DateTimePicker}>
                      <div>
                        <h5>Date (e.g. "23/12/2018")</h5>
                        <input
                          type="date"
                          name="date"
                          value={this.props.date}
                          onChange={event =>
                            this.props.changeDate(event.target.value)}
                        />
                      </div>
                      <div>
                        <h5>Time (e.g. "09:15 AM")</h5>
                        <input
                          type="time"
                          name="time"
                          value={this.props.time}
                          onChange={event =>
                            this.props.changeTime(event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {settingsMenuId === 1 ? (
                  <div>
                    <h4 style={{ padding: 0, margin: 0 }}>Map settings</h4>
                    <hr />
                    <div className={styles.MapSettings}>
                      <p>
                        There are {mapBackgrounds
                          ? mapBackgrounds.length
                          : 0}{" "}
                        available map background(s):
                        {mapBackgrounds[0].description} and&nbsp;
                        {mapBackgrounds[1].description}.
                      </p>
                      <p>
                        Currently selected:&nbsp;
                        <strong>
                          {this.props.currentMapBackground.description}
                        </strong>.
                      </p>
                      <button onClick={this.toggleMapBackground.bind(this)}>
                        Switch
                      </button>
                    </div>
                  </div>
                ) : null}

                {settingsMenuId === 2 ? (
                  <div>
                    <h4 style={{ padding: 0, margin: 0 }}>Contact info</h4>
                    <hr />
                    <p>
                      For software issues with the FISH Dashboard please contact
                      Nelen & Schuurmans on {nensMail()}.
                    </p>
                  </div>
                ) : null}
              </main>
            </div>
          </div>
        </DocumentTitle>
      );
    }

    const tileComponents = tiles.map(tile => {
      const shortTitle = tile.shortTitle || tile.title;

      switch (tile.type) {
        case "map":
          return (
            <Tile
              {...this.props}
              title={shortTitle}
              onClick={() => history.push(`/full/${tile.id}`)}
            >
              <Map isFull={false} bbox={tile.bbox} tile={tile} />
            </Tile>
          );
        case "timeseries":
          return (
            <Tile
              {...this.props}
              title={shortTitle}
              onClick={() => history.push(`/full/${tile.id}`)}
            >
              <TimeseriesTile
                isFull={false}
                timeseries={tile.timeseries}
                tile={tile}
                showAxis={true}
                marginLeft={0}
                marginTop={30}
              />
            </Tile>
          );
        case "statistics":
          return (
            <Tile
              {...this.props}
              title={shortTitle}
              onClick={() => history.push(`/full/${tile.id}`)}
            >
              <StatisticsTile
                alarms={this.props.alarms}
                title="Triggered alarms"
              />
            </Tile>
          );
        case "external":
          return (
            <Tile
              {...this.props}
              title={shortTitle}
              backgroundColor={"#FFFFFF"}
              onClick={() => history.push(`/full/${tile.id}`)}
            >
              <ExternalTile isFull={false} tile={tile} />
            </Tile>
          );
        default:
          return null;
      }
    });

    return (
      <DocumentTitle title={title}>
        <div className={styles.GridLayoutHeaderContainer}>
          <div className={styles.GridLayoutLogoContainer}>
            <img src={logoPath} alt="Logos for relevant organisations" />
          </div>

          <div className={styles.GridLayoutHeaderTitle}>{title}</div>

          <div className={styles.GridLayoutHeaderButtons}>
            {width > 700 ? (
              <div
                className={styles.SettingsButton}
                onClick={() =>
                  this.setState({
                    settingsMenu: true
                  })}
              >
                <span>
                  <i className="material-icons">settings</i>&nbsp;&nbsp;Settings
                </span>
                <Ink />
              </div>
            ) : null}

            <div
              className={styles.LogoutButton}
              onClick={() => this.props.session.bootstrap.doLogout()}
            >
              {width > 700 ? (
                <span>
                  <i className="material-icons">lock</i>&nbsp;&nbsp;Log out
                </span>
              ) : (
                <i className="material-icons">lock</i>
              )}
              <Ink />
            </div>
          </div>

          <ReactGridLayout
            isDraggable={canMove}
            isResizable={canMove}
            className={`${styles.GridLayoutContainer + " layout"}`}
            layout={this.getLayout()}
            rowHeight={30}
            width={width}
            draggableHandle=".drag-handle"
          >
            {tileComponents.map((component, i) => {
              return <div key={i}>{component}</div>;
            })}
          </ReactGridLayout>
          <footer className={styles.Footer}>Nelen &amp; Schuurmans</footer>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session,
    tiles: getAllTiles(state),
    alarms: state.alarms,
    date: getConfiguredDate(state),
    time: getConfiguredTime(state),
    availableMapBackgrounds: getConfiguredMapBackgrounds(state),
    currentMapBackground: (s => {
      return getCurrentMapBackground(s) || getConfiguredMapBackgrounds(s)[0];
    })(state),
    title: getConfiguredTitle(state),
    logoPath: getConfiguredLogoPath(state),
    columnCount: getConfiguredColumnCount(state),
    headerColors: getConfiguredTileHeaderColors(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeDate: setDateAction(dispatch),
    changeTime: setTimeAction(dispatch),
    resetDateTime: resetDateTimeAction(dispatch),
    setMapBackground: setMapBackgroundAction(dispatch)
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GridLayout)
);
