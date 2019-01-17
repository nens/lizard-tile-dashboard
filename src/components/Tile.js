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
        </div>
        {children}
      </div>
    );
  }
}

export default Tile;
