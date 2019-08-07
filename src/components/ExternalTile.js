import React, { Component } from "react";
import styles from "./ExternalTile.css";
import externalIcon from "../graphics/icon-external.svg";

class ExternalTileComponent extends Component {
  constructor() {
    super();
    this.state = {
      randomId: "external-tile-" + Math.floor(Math.random() * 10000),
      fullRenderWidth: null,
      fullRenderHeight: null
    };
    this.alignImgVertically = this.alignImgVertically.bind(this);
  }

  componentDidMount() {
    if (this.props.isFull) {
      const {
        width,
        height,
        fullLayoutSidebarWidth,
        fullLayoutHeaderHeight
      } = this.props;

      this.setState({
        fullRenderWidth: width - fullLayoutSidebarWidth,
        fullRenderHeight: height - fullLayoutHeaderHeight
      });
      window.addEventListener("resize", this.alignImgVertically, true);
    }
  }

  componentWillUnmount() {
    if (this.props.isFull) {
      window.removeEventListener("resize", this.alignImgVertically);
    }
  }

  alignImgVertically() {
    const imgElem = document.getElementById(this.state.randomId);
    if (imgElem === null) {
      return;
    }

    const verticalWhiteSpace = this.state.fullRenderHeight - imgElem.height;
    const requiredTopOffset = Math.floor(verticalWhiteSpace / 2);

    imgElem.style.top = requiredTopOffset + "px";
  }

  render() {
    const {
      isFull,
      tile,
      fullLayoutSidebarWidth,
      showingBar,
      source
    } = this.props;
    const { title, url, imageUrl, renderAsImage } = tile;

    switch (source) {
      case "GridLayout":
        if (imageUrl) {
          return this.renderImage(
            title,
            imageUrl,
            isFull, // false
            showingBar, // false
            fullLayoutSidebarWidth // undefined
          );
        } else {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100%"
              }}
            >
              <img
                src={externalIcon}
                alt="External"
              />
            </div>
          );
        }
      case "FullLayout":
        if (renderAsImage) {
          return this.renderImage(
            title,
            imageUrl,
            isFull,
            showingBar,
            fullLayoutSidebarWidth
          );
        } else {
          return url
            ? this.renderIframe(title, url, showingBar, fullLayoutSidebarWidth)
            : this.renderImage(
                title,
                imageUrl,
                isFull,
                showingBar,
                fullLayoutSidebarWidth
              );
        }
      default:
        return null;
    }
  }

  renderIframe(title, url, showingBar, fullLayoutSidebarWidth) {
    return (
      <iframe
        id={this.state.randomId}
        title="externalTile"
        referrerPolicy="no-referrer"
        src={url}
        className={styles.ExternalIframe}
        width={showingBar ? this.state.fullRenderWidth : window.innerWidth}
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
      
      <img
        id={this.state.randomId}
        src={imageUrl}
        alt={title}
        className={styles.ExternalImageTile}
      />
    );
  }
}

export default ExternalTileComponent;
