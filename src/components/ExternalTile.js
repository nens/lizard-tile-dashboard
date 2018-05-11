import React, { Component } from "react";
import styles from "./ExternalTile.css";
import last from "lodash/last";

class ExternalTileComponent extends Component {
  constructor() {
    super();
    this.state = {
      randomId: "external-tile-" + Math.floor(Math.random() * 10000),
      fullRenderWidth: null,
      fullRenderHeight: null
    };
    this.setImgDimsTile = this.setImgDimsTile.bind(this);
    this.alignImgVertically = this.alignImgVertically.bind(this);
  }

  componentDidMount() {
    console.log("[F] componentDidMount");
    if (this.props.isFull) {
      this.setState({
        fullRenderWidth: this.props.width - this.props.fullLayoutSidebarWidth,
        fullRenderHeight: this.props.height - this.props.fullLayoutHeaderHeight
      });
      window.addEventListener("resize", this.alignImgVertically, true);
    }
  }

  componentWillUnmount() {
    if (this.props.isFull) {
      window.removeEventListener("resize", this.alignImgVertically);
    }
  }

  setImgDimsTile() {
    const TILE_INNER_HEIGHT = 270, // 310px (tileHeight) - 40px (=tileHeaderHeight)
      imgElem = document.getElementById(this.state.randomId),
      imgOriginalWidth = imgElem.width,
      imgOriginalHeight = imgElem.height;

    if (imgOriginalHeight !== TILE_INNER_HEIGHT) {
      console.log(
        "[+] Adjusting height for img:",
        last(imgElem.src.split("/"))
      );
      // We need to scale the image height (and width, to keep the aspect
      // consistent) to fit the tile nicely:
      const scaleFactor = TILE_INNER_HEIGHT / imgOriginalHeight,
        adjustedWidth = Math.floor(imgOriginalWidth * scaleFactor),
        adjustedHeight = Math.floor(imgOriginalHeight * scaleFactor);
      imgElem.width = adjustedWidth;
      imgElem.height = adjustedHeight;
    }
  }

  // setImgDimsFull() {
  //   console.log("[F] setImgDimsFull");

  //   // case A: image is smaller than available w*h
  //   // ==> scale up

  //   const imgElem = document.getElementById(this.state.randomId),
  //     imgOriginalWidth = imgElem.width,
  //     imgOriginalHeight = imgElem.height;

  //   const aspectMode = imgOriginalWidth > imgOriginalHeight
  //     ? "LANDSCAPE"
  //     : "PORTRAIT";

  //   console.log("*** aspectMode =", aspectMode);

  //   if (aspectMode === "PORTRAIT") {

  //   }

  //   // case B: image is wider than available width
  //   // ==> scale down
  //   // case C: image is higher than available height
  //   // ==> scale down

  //   // ==> NOT NEEDED, FIXED VIA CSS: SET MAX_WIDTH/MAX_HEIGHT To 100% :)
  // }

  alignImgVertically() {
    console.log("[F] alignImgVertically");
    const imgElem = document.getElementById(this.state.randomId);
    if (imgElem === null) {
      return;
    }

    const verticalWhiteSpace = this.state.fullRenderHeight - imgElem.height;
    const requiredTopOffset = Math.floor(verticalWhiteSpace / 2);

    imgElem.style.top = requiredTopOffset + "px";
  }

  render() {
    const { isFull, tile, fullLayoutSidebarWidth, showingBar } = this.props;
    const { title, url, imageUrl, renderAsImage } = tile;

    return renderAsImage
      ? this.renderImage(
          title,
          imageUrl,
          isFull,
          showingBar,
          fullLayoutSidebarWidth
        )
      : this.renderIframe(title, url, showingBar);
  }

  renderIframe(title, url, showingBar, fullLayoutSidebarWidth) {
    return (
      <iframe
        id={this.state.randomId}
        title="externalTile"
        referrerPolicy="no-referrer"
        src={url}
        className={styles.ExternalIframe}
        width={this.state.fullRenderWidth}
        height={this.state.fullRenderHeight}
        style={{ left: showingBar ? fullLayoutSidebarWidth : 0 }}
      />
    );
  }

  renderImage(title, imageUrl, isFull, showingBar) {
    if (isFull) {
      const imgElem = document.getElementById(this.state.randomId);
      if (imgElem) {
        imgElem.style.opacity = 0;
        setTimeout(() => {
          imgElem.style.opacity = 1;
        }, 150);
        // const iv = setInterval(() => {
        //   imgElem.style.opacity += 0.01
        //   if (imgElem.style.opacity >= 1) {
        //     clearInterval(iv);
        //   }
        // }, 5);
      }
    }

    return isFull ? (
      <div
        className={styles.ExternalWrapperFull}
        style={{
          height: this.state.fullRenderHeight + "px",
          // top: this.props.fullLayoutHeaderHeight,
          left: showingBar ? this.props.fullLayoutSidebarWidth * 0.5 + "px" : 0
        }}
      >
        <img
          id={this.state.randomId}
          onLoad={this.alignImgVertically}
          src={imageUrl}
          alt={title}
          className={styles.ExternalImageFull}
        />
      </div>
    ) : (
      <div
        className={styles.ExternalWrapperTile}
        style={{
          height: "100%"
        }}
      >
        <img
          id={this.state.randomId}
          onLoad={this.setImgDimsTile}
          src={imageUrl}
          alt={title}
          className={styles.ExternalImageTile}
        />
      </div>
    );
  }
}

export default ExternalTileComponent;
