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
import last from "lodash/last";
import map from "lodash/map";
import Map from "./Map";
import logo_Lizard from "../graphics/logo-Lizard.png";
import { Image } from "react-bootstrap";

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
  getConfiguredTileHeaderColors,
  getGridSizeIsConfigurablePerTile,
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

    const { columnCount } = props;
    let layout;
    if (this.props.gridSizeIsConfigurablePerTile === true) {
      // use layout as configured on tile in client_configuaration json
      layout = this.props.tiles.map((tile) => tile.sizeAndLocationInGrid);
    }
    else {
      layout = this.props.tiles.map((tile, i) => {
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
      });
    }

    this.state = {
      canMove: false,
      layout: layout,
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
      width: window.innerWidth,
      height: window.innerHeight,
      settingsMenu: false,
      settingsMenuId: 0
    };
    this.handleUpdateDimensions = this.handleUpdateDimensions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getMapBackgroundsDescription = this.getMapBackgroundsDescription.bind(
      this
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleUpdateDimensions, false);
    document.addEventListener("keydown", this.handleKeyPress, false);
  }
  componentWillUnmount() {
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
    const allDescriptions = map(available, "description");
    const currentIdx = allDescriptions.indexOf(current.description);
    const newIdx = currentIdx === available.length - 1 ? 0 : currentIdx + 1;
    this.props.setMapBackground(available[newIdx]);
  }
  getMapBackgroundsDescription() {
    const available = this.props.availableMapBackgrounds;

    if (!available || available.length === 0) {
      console.error("[E] configuration error: no background-maps were found!");
    } else if (available.length === 1) {
      return (
        "There is only a single map background configured: " +
        available[0].description
      );
    } else {
      let i,
        description = "";
      for (i = 0; i < available.length - 1; i++)
        description += available[i].description + ", ";
      description =
        description.slice(0, description.length - 2) +
        " and " +
        last(available).description;
      return (
        "There are " +
        available.length +
        " map backgrounds configured: " +
        description
      );
    }
  }
  checkRadioButtonMapSelection(mapBackground) {
    if (mapBackground.description === this.props.currentMapBackground.description) return true;
  }
  getLayout() {
    return this.state.width < 820 ? this.state.mobileLayout : this.state.layout;
  }
  render() {
    const { width, height, canMove, settingsMenu } = this.state;

    const { tiles, history, title, logoPath } = this.props;

    const mapBackgrounds = this.props.availableMapBackgrounds;

    if (settingsMenu) {
      return (
        <DocumentTitle title={title + " | Settings"}>
          <div className={styles.SettingsMenu} style={{ height: height }}>
            <div
              onClick={() => this.setState({ settingsMenu: false })}
              className={styles.SettingsMenuBackButton}
            >
              <i className="material-icons">keyboard_backspace</i>
            </div>
            <h1>Peilbeheer instellingen</h1>
            <div className={styles.SettingsMenuMain}>
              <div className={styles.DateTimeSettings}>
                <h2>Datum en tijdsinstellingen</h2>
                <div className={styles.DateTimePicker}>
                  <input
                    type="date"
                    name="date"
                    value={this.props.date}
                    onChange={event => this.props.changeDate(event.target.value)}
                  />
                  &nbsp;&nbsp;
                  <input
                    type="time"
                    name="time"
                    value={this.props.time}
                    onChange={event => this.props.changeTime(event.target.value)}
                  />
                </div>
              </div>
              <div className={styles.MapSettings}>
                <h2>Achtergrond</h2>
                <div className={styles.MapStyleSelection}>
                  {mapBackgrounds.map(mapBackground =>
                    <div key={mapBackground.description}>
                      <input
                        type="radio"
                        name="map"
                        id={mapBackground.description}
                        onChange={() => this.props.setMapBackground(mapBackground)}
                        checked={this.checkRadioButtonMapSelection(mapBackground)}
                      />
                      <label htmlFor={mapBackground.description}>{mapBackground.description}</label>
                    </div>
                  )}
                </div>
                <button
                  className={styles.SettingsMenuSaveButton}
                  onClick={() => this.setState({ settingsMenu: false })}
                >
                  Alles Opslaan
                </button>
              </div>
            </div>
          </div>
        </DocumentTitle>
      );
    }

    const tileComponents = tiles.map(tile => {
      const shortTitle = tile.shortTitle || tile.title;
      if (tile.imageUrl) {
        return (
          <Tile
            {...this.props}
            title={shortTitle}
            backgroundColor={"#FFFFFF"}
            onClick={() => history.push(`/full/${tile.id}`)}
          >
            <ExternalTile isFull={false} tile={tile} source={"GridLayout"} />
          </Tile>
        );
      } else {
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
                <ExternalTile
                  isFull={false}
                  tile={tile}
                  source={"GridLayout"}
                />
              </Tile>
            );
          default:
            return null;
        }
      }
    });

    return (
      <DocumentTitle title={title}>
        <div className={styles.GridLayoutHeaderContainer}>
          <div className={styles.GridLayoutHeader}>
            <div className={styles.GridLayoutLogoContainer}>
              <img src={logoPath} alt="Logo" />
            </div>
            <div className={styles.GridLayoutHeaderTitle}>
              <div>{title}</div>
            </div>
            <div className={styles.GridLayoutHeaderButtons}>
              <div
                className={styles.SettingsButton}
                onClick={() =>
                  this.setState({
                    settingsMenu: true
                  })}
              >
                {width > 820 ? (
                  <span><i className="material-icons">settings</i>&nbsp;&nbsp;Settings</span>
                ) : (
                  <span title="Settings"><i className="material-icons">settings</i></span>
                )}
                <Ink />
              </div>
              <a
                className={styles.BackButton}
                href="/dashboards"
              >
                {width > 820 ? (
                  <span><i className="material-icons">arrow_back</i>&nbsp;&nbsp;Back</span>
                ) : (
                  <span title="Back"><i className="material-icons">arrow_back</i></span>
                )}
                <Ink />
              </a>
            </div>
          </div>

          <ReactGridLayout
            isDraggable={canMove}
            isResizable={canMove}
            className={`${styles.GridLayoutContainer + " layout"}`}
            layout={this.getLayout()}
            rowHeight={30}
            width={width - 10} /* to fix minor overflow on x axis */
            draggableHandle=".drag-handle"
          >
            {tileComponents.map((component, i) => {
              return <div key={i}>{component}</div>;
            })}
          </ReactGridLayout>
          <footer className={styles.Footer}>Nelen &amp; Schuurmans</footer>
          <div className="container" id="footer">
            <div className={styles.logoContainer}>
              <a href={"https://www.lizard.net/"}>
                <span className={styles.logoContainerSpan}>
                  Powered by Lizard
                </span>
                <span className={styles.logoContainerSpan}>
                  <Image
                    src={logo_Lizard}
                    className={styles.logo}
                    title="Lizard"
                    style={{ margin: "auto" }}
                  />
                </span>
              </a>
            </div>
          </div>
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
    gridSizeIsConfigurablePerTile: getGridSizeIsConfigurablePerTile(state),
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
