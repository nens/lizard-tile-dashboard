import React, { Component } from "react";
import styles from "./Tile.css";

class Tile extends Component {
  render() {
    const {
      onClick,
      title,
      children,
      backgroundColor,
      headerColors
    } = this.props;

    console.log("[F] Tileṙender; headerColors =", headerColors);

    return (
      <div
        style={{
          backgroundColor: backgroundColor ? backgroundColor : "#ffffff"
        }}
        className={styles.Tile}
        onClick={onClick}
      >
        <div
          className={styles.TileTitle}
          style={{ backgroundColor: headerColors.bg }}
        >
          <div
            style={{ color: headerColors.fg }}
            className={styles.TileHeaderText + " drag-handle"}
          >
            {title}
          </div>
          <i className={`${styles.TileHandle} material-icons`}>more_vert</i>
        </div>
        {children}
      </div>
    );
  }
}

export default Tile;
