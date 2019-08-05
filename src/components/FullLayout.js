import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import StatisticsTile from "./StatisticsTile";
import Map from "./Map";
import FullStatistics from "./FullStatistics";
import ExternalTile from "./ExternalTile";
import TimeseriesTile from "./TimeseriesTile";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import styles from "./FullLayout.css";
import {
  getAllTiles,
  getTileById,
  getConfiguredTileHeaderColors,
  getConfiguredTitle
} from "../reducers";

import mapIcon from "../graphics/icon-map.svg";
import timeIcon from "../graphics/icon-chart.svg";
import externalIcon from "../graphics/icon-external.svg";

const FULL_LAYOUT_HEADER_HEIGHT = 50;
const FULL_LAYOUT_SIDEBAR_WIDTH = 195;
const PREVIEW_TILE_WIDTH = 150;

class FullLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.handleUpdateDimensions = this.handleUpdateDimensions.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleUpdateDimensions, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleUpdateDimensions, false);
  }
  handleUpdateDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  updateExternalPreviewTile(randomId) {
    const imgTag = document.getElementById(randomId);
    const { naturalWidth, naturalHeight } = imgTag;

    let ratio, w, h, marginTop;

    if (naturalWidth > naturalHeight) {
      ratio = PREVIEW_TILE_WIDTH / naturalWidth;
      w = ratio * naturalWidth;
      h = ratio * naturalHeight;
      marginTop = parseInt(Math.floor(PREVIEW_TILE_WIDTH - h) / 2, 10);
      imgTag.style["margin-top"] = marginTop + "px";
    } else {
      ratio = PREVIEW_TILE_WIDTH / naturalHeight;
      w = ratio * naturalWidth;
      h = ratio * naturalHeight;
    }
    imgTag.style.width = w + "px";
    imgTag.style.height = h + "px";
  }
  render() {
    const { id } = this.props.match.params;
    const { getTileById, allTiles, title } = this.props;
    const { height, width } = this.state;
    const tilesById = getTileById(id);
    const selectedTile = tilesById[0];
    const isMobile = width < 700 ? true : false;
    if (tilesById.length === 0) {
      return <div />;
    }

    let element = null;
    switch (selectedTile.type) {
      case "map":
        element = (
          <Map
            {...this.props}
            isFull={true}
            width={width}
            height={height}
            tile={selectedTile}
            bbox={selectedTile.bbox}
          />
        );
        break;
      case "statistics":
        element = (
          <FullStatistics
            tile={selectedTile}
            width={width}
            height={height}
            isMobile={isMobile}
          />
        );
        break;
      case "timeseries":
        element = (
          <TimeseriesTile
            isFull={true}
            timeseries={selectedTile.timeseries}
            tile={selectedTile}
            showAxis={true}
            marginLeft={isMobile ? 0 : FULL_LAYOUT_SIDEBAR_WIDTH}
            marginTop={50}
          />
        );
        break;
      case "external":
        element = (
          <ExternalTile
            tile={selectedTile}
            isFull={true}
            fullLayoutHeaderHeight={FULL_LAYOUT_HEADER_HEIGHT}
            fullLayoutSidebarWidth={FULL_LAYOUT_SIDEBAR_WIDTH}
            width={width}
            height={height}
            showingBar={!isMobile}
            source={"FullLayout"}
          />
        );
        break;
      default:
        element = null;
        break;
    }

    const fgColor = this.props.configuredTileHeaderColors.fg;
    const bgColor = this.props.configuredTileHeaderColors.bg;

    return (
      <DocumentTitle title={`${title} | ${selectedTile.title}`}>
        <div className={styles.FullLayout}>
          
          <div
            className={styles.TitleBar}
            style={{
              color: fgColor,
              backgroundColor: bgColor,
              height: FULL_LAYOUT_HEADER_HEIGHT + "px"
            }}
          >
            <NavLink to="/">
              <div className={styles.BackButton}>
                <i className="material-icons" style={{ color: fgColor }}>
                  arrow_back
                </i>
              </div>
            </NavLink>
            <div className={styles.Title}>{selectedTile.title}</div>
            {selectedTile.viewInLizardLink ? (
              <div className={styles.ViewInLizardButton}>
                <a
                  href={selectedTile.viewInLizardLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ViewInLizardLink}
                  style={{ color: fgColor }}
                >
                  View in portal
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={styles.Content}
          >
            {!isMobile ? (
              <div
                className={styles.SidebarWrapper}
                style={{ 
                  height: height - FULL_LAYOUT_HEADER_HEIGHT,
                  // paddingTop: FULL_LAYOUT_HEADER_HEIGHT,
                }}
              >
                <Scrollbars height={height}>
                  {allTiles.map((tile, i) => {
                    let previewTile = null;

                    // Show image if imageUrl is set
                    if (tile.imageUrl) {
                      const randomId =
                        "img-id-" + parseInt(Math.random() * 10000, 10);
                      previewTile = (
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            id={randomId}
                            onLoad={() =>
                              this.updateExternalPreviewTile(randomId)}
                            src={tile.imageUrl}
                            alt="Preview"
                          />
                        </div>
                      );
                    } else {
                      switch (tile.type) {
                        case "map":
                          previewTile = (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center"
                              }}
                            >
                              <img
                                style={{ width: PREVIEW_TILE_WIDTH / 2 }}
                                src={mapIcon}
                                alt="Map"
                              />
                            </div>
                          );
                          break;
                        case "timeseries":
                          previewTile = (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center"
                              }}
                            >
                              <img
                                style={{ width: PREVIEW_TILE_WIDTH / 2 }}
                                src={timeIcon}
                                alt="Timeseries"
                              />
                            </div>
                          );
                          break;
                        case "statistics":
                          previewTile = (
                            <StatisticsTile
                              alarms={this.props.alarms}
                              title={tile.title}
                            />
                          );
                          break;
                        case "external":
                          previewTile = (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center"
                              }}
                            >
                              <img
                                style={{ width: PREVIEW_TILE_WIDTH / 2 }}
                                src={externalIcon}
                                alt="External"
                              />
                            </div>
                          );
                          break;
                        default:
                          previewTile = null;
                          break;
                      }
                    }

                    const shortTitle = tile.shortTitle || tile.title;

                    return (
                      <NavLink to={`/full/${tile.id}`} key={i}>
                        <div
                          className={styles.SidebarItemWrapper}
                          title={shortTitle}
                        >
                          <div
                            className={`${styles.SidebarItem} ${selectedTile.id ===
                            tile.id
                              ? styles.Active
                              : null}`}
                          >
                            {previewTile}
                          </div>
                          <div className={styles.SidebarItemLabel}>
                            {shortTitle}
                          </div>
                        </div>
                      </NavLink>
                    );
                  })}
                </Scrollbars>
              </div>
            ) : null}
            {element}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allTiles: getAllTiles(state),
    getTileById: id => getTileById(state, id),
    alarms: state.alarms,
    configuredTileHeaderColors: getConfiguredTileHeaderColors(state),
    title: getConfiguredTitle(state)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FullLayout)
);
