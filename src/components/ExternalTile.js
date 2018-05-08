import React, { Component } from "react";
import styles from "./ExternalTile.css";

class ExternalTileComponent extends Component {
  constructor() {
    super();
    this.state = {
      randomId: "external-tile-" + Math.floor(Math.random() * 10000)
    };
    this.setImgDims = this.setImgDims.bind(this);
  }

  setImgDims() {
    const TILE_INNER_HEIGHT = 270, // 310px (tileHeight) - 40px (=headerHeight)
      imgElem = document.getElementById(this.state.randomId),
      imgOriginalWidth = imgElem.width,
      imgOriginalHeight = imgElem.height;

    if (imgOriginalHeight !== TILE_INNER_HEIGHT) {
      // We need to scale the image height (and width, to keep the aspect
      // consistent) to fit the tile nicely:
      const scaleFactor = TILE_INNER_HEIGHT / imgOriginalHeight,
        adjustedWidth = Math.floor(imgOriginalWidth * scaleFactor),
        adjustedHeight = Math.floor(imgOriginalHeight * scaleFactor);
      imgElem.width = adjustedWidth;
      imgElem.height = adjustedHeight;
    } // TODO: variable width
  }

  render() {
    const { isFull, tile, width, height } = this.props;

    if (isFull) {
      return this.renderIframe(tile.title, tile.url, width, height);
    } else {
      return this.renderImage(tile.title, tile.imageUrl);
    }
  }

  renderIframe(title, url, width, height) {
    const { showingBar } = this.props;

    return (
      <iframe
        id={this.state.randomId}
        title="externalTile"
        referrerPolicy="no-referrer"
        src={url}
        className={styles.externalIframe}
        width={width}
        height={height}
        style={{
          left: showingBar ? 205 : 0
        }}
      />
    );
  }

  renderImage(title, imageUrl) {
    return (
      <div className={styles.externalWrapper}>
        <img
          id={this.state.randomId}
          onLoad={this.setImgDims}
          src={imageUrl}
          alt={title}
          className={styles.externalImage}
        />
      </div>
    );
  }
}

export default ExternalTileComponent;
