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
          style={headerColors.bg? { backgroundColor: headerColors.bg }: {}}
        >
          <div
            style={headerColors.fg?{ color: headerColors.fg }:{}}
            className={styles.TileHeaderText + " drag-handle"}
          >
            {title}
          </div>
        </div>
        <div
          className={styles.TileBody}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Tile;
