import React, { Component } from "react";
// import { BOUNDS } from "../config";
import { connect } from "react-redux";
import MDSpinner from "react-md-spinner";
import { find } from "lodash";
import { updateTimeseriesMetadata, fetchRaster, addAsset } from "../actions";
import {
  getReferenceLevels,
  getAllTiles,
  getConfiguredMapBackgrounds,
  getCurrentMapBackground,
  getConfiguredPortalBBox
} from "../reducers";
import { withRouter } from "react-router-dom";

import {
  getMeasuringStations,
  makeGetter,
  getOrFetch,
  DateTime
} from "../api_client/index";
import { BoundingBox, isSamePoint } from "../util/bounds";
import logo_lizard from "../graphics/logo-Lizard.png";
import L from "leaflet";
import { Map, Marker, Popup, TileLayer, WMSTileLayer } from "react-leaflet";
import Legend from "./Legend";
import styles from "./Map.css";
import dataStyles from "../style/Data.css";
import popupStyles from "./Popup.css";
import { IconActiveAlarm, IconInactiveAlarm, IconNoAlarm } from "./MapIcons";


class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureInfo: {
        show: false,
        latlng: null,
        data: null
      },
    }
  }
  componentDidMount() {
    const { tile } = this.props;
    const inBboxFilter = this.getBBox().toLizardBbox();

    // reference to get acces to leaflet Map API
    // Is there another option to do this?
    // Also we need to ad the ref only on render-full -> will this impose problem?
    this.leafletMapRef = React.createRef();

    if (tile.assetTypes) {
      tile.assetTypes.forEach(assetType => {
        // This is really impossible, need something more generic
        if (assetType === "measuringstation") {
          getMeasuringStations({
            in_bbox: inBboxFilter,
            page_size: 1000
          }).then(results => {
            results.forEach(measuringStation => {
              this.props.addAsset(
                "measuringstation",
                measuringStation.id,
                measuringStation
              );
            });
          });
        }
      });
    }
  }

  

  getBBox() {
    // Either get it from the tile or return the JSON configured constant.
    if (this.props && this.props.tile && this.props.tile.bbox) {
      const bbox = this.props.tile.bbox;
      return new BoundingBox(bbox[0], bbox[1], bbox[2], bbox[3]);
    } else {
      return this.props.portalBBox;
    }
  }

  tileLayerForRaster(raster) {
    let rasterObject = getOrFetch(
      this.props.getRaster,
      this.props.fetchRaster,
      raster.uuid
    );

    if (!rasterObject) {
      return null;
    }

    let wmsUrl;
    if (rasterObject.last_value_timestamp && this.props.tile.datetime) {
      wmsUrl = rasterObject.wms_info.addTimeToEndpoint(
        new DateTime(this.props.tile.datetime),
        rasterObject.first_value_timestamp,
        rasterObject.last_value_timestamp
      );
    } else {
      wmsUrl = rasterObject.wms_info.endpoint;
    }

    const rasterOpacity = raster.opacity
      ? Number.parseFloat(raster.opacity)
      : 0;
    // console.log("[dbg] rasterOpacity =", rasterOpacity);

    return (
      <WMSTileLayer
        url={wmsUrl}
        key={rasterObject.uuid}
        layers={rasterObject.wms_info.layer}
        styles={rasterObject.options.styles}
        opacity={rasterOpacity}
        transparent={true}
        format={"image/png"}
      />
    );
  }

  iconForAsset(asset) {
    // Return true if there is a raster alarm at the same location and it is active.
    if (!this.props.alarms.timeseriesData) return IconNoAlarm;

    // Get the first alarm for this geometry
    const alarm = find(this.props.alarms.timeseriesData, alarm =>
      alarm.belongsToAsset(asset)
    );

    if (!alarm) return IconNoAlarm;

    if (alarm.activeWarning()) {
      return IconActiveAlarm;
    } else {
      return IconInactiveAlarm;
    }
  }

  getTileLinkForTimeseries(tsUuids) {
    for (let i = 0; i < tsUuids.length; i++) {
      let uuid = tsUuids[i];

      for (let j = 0; j < this.props.allTiles.length; j++) {
        let tile = this.props.allTiles[j];

        if (tile.type !== "timeseries") continue;

        if (tile.timeseries && tile.timeseries.indexOf(uuid) !== -1) {
          // Return a link to this tile.
          return `/full/${tile.id}`;
        }
      }
    }

    // No tile found.
    return null;
  }

  getTileLinkForGeometry(point) {
    for (var j = 0; j < this.props.allTiles.length; j++) {
      const tile = this.props.allTiles[j];

      if (tile.type !== "timeseries") continue;

      if (
        find(tile.rasterIntersections || [], intersection =>
          isSamePoint(point, intersection.geometry)
        )
      ) {
        // Return a link to this tile.
        return `/full/${tile.id}`;
      }
    }
  }

  getPopup(asset) {
    if (!this.props.isFull) return null;

    let timeseriesTable;
    var link = null;

    if (!asset.timeseries || !asset.timeseries.length) {
      timeseriesTable = <p>This asset has no timeseries.</p>;
    } else {
      link = this.getTileLinkForTimeseries(asset.timeseries.map(ts => ts.uuid));

      const timeseriesWithMetadata = asset.timeseries.filter(
        ts => this.props.timeseriesMetadata[ts.uuid]
      );

      if (timeseriesWithMetadata.length) {
        // Create a table with units and latest values.
        const rows = timeseriesWithMetadata.map((ts, idx) => {
          const metadata = this.props.timeseriesMetadata[ts.uuid];
          return (
            <tr key={idx}>
              <td>{metadata.name}</td>
              <td>{metadata.last_value}</td>
              <td>{metadata.observation_type.unit || ""}</td>
            </tr>
          );
        });
        timeseriesTable = (
          <table className={styles.PopupTable}>
            <thead>
              <tr>
                <td>
                  <strong>Timeseries name</strong>
                </td>
                <td>
                  <strong>Last value</strong>
                </td>
                <td>
                  <strong>Unit</strong>
                </td>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        );
      } else {
        timeseriesTable = <p>Loading timeseries...</p>;
      }
    }

    const linkSpan = link ? (
      <button onClick={() => this.props.history.push(link)}>View Chart</button>
    ) : null;

    const referenceLevels = this.props.referenceLevels;
    let referenceLevelText = null;
    if (referenceLevels && referenceLevels[asset.id] !== undefined) {
      referenceLevelText = (
        <p>
          <strong>Reference level: {referenceLevels[asset.id]}</strong>
        </p>
      );
    }

    return (
      <Popup minWidth={250} keepInView={true}>
        <div className={styles.Popup}>
          <p>
            <strong>{asset.name}</strong>
            &nbsp;{linkSpan}
          </p>
          {referenceLevelText}
          {timeseriesTable}
        </div>
      </Popup>
    );
  }

  clickMarker(assetType, assetId) {
    const asset = this.props.assets[assetType][assetId];

    if (!asset.timeseries) return;

    asset.timeseries.forEach(this.props.updateTimeseries);
  }

  markers() {
    const allMarkers = this.assetMarkers().concat(this.geometryMarkers());
    return allMarkers.length ? allMarkers : null;
  }

  assetMarkers() {
    const { tile } = this.props;
    if (!tile.assetTypes) return [];

    const markers = [];
    tile.assetTypes.forEach(assetType => {
      const assets = this.props.assets[assetType] || {};
      Object.values(assets).forEach(asset => {
        const { coordinates } = asset.geometry;
        const alarmIcon = this.iconForAsset(asset);
        const marker = (
          <Marker
            key={asset.id}
            icon={alarmIcon}
            position={[coordinates[1], coordinates[0]]}
            onclick={() =>
              this.props.isFull && this.clickMarker(assetType, asset.id)}
          >
            {this.getPopup(asset)}
          </Marker>
        );
        markers.push(marker);
      });
    });
    return markers;
  }

  iconForGeometry(point) {
    // Return true if there is a raster alarm at the same location and it is active.
    if (!this.props.alarms.rasterData) return IconNoAlarm;

    // Get the first alarm for this geometry
    const alarm = find(this.props.alarms.rasterData, alarm =>
      alarm.sameGeometry(point)
    );

    if (!alarm) return IconNoAlarm;

    if (alarm.activeWarning()) {
      return IconActiveAlarm;
    } else {
      return IconInactiveAlarm;
    }
  }

  geometryMarkers() {
    const { tile } = this.props;
    if (!tile.points) return [];

    const markers = [];
    tile.points.forEach((point, idx) => {
      const { coordinates } = point.geometry;
      const alarmIcon = this.iconForGeometry(point.geometry);
      const link = this.getTileLinkForGeometry(point.geometry);

      const linkSpan = link ? (
        <button onClick={() => this.props.history.push(link)}>
          View Chart
        </button>
      ) : null;

      const marker = (
        <Marker
          key={"point-" + idx}
          icon={alarmIcon}
          position={[
            Number.parseFloat(coordinates[1]),
            Number.parseFloat(coordinates[0])
          ]}
        >
          <Popup minWidth={250} keepInView={true}>
            <div className={styles.Popup}>
              <p>
                <strong>{point.title}</strong>
                &nbsp;{linkSpan}
              </p>
            </div>
          </Popup>
        </Marker>
      );
      markers.push(marker);
    });
    return markers;
  }

  tileHasVectors(tile) {
    return tile.type === "map" && tile.assetTypes && tile.assetTypes.length > 0;
  }

  getFromUrl (url) {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
  
      request.onreadystatechange = function () {
        if (this.readyState !== 4) return;
  
        if (this.status >= 200 && this.status < 300) {
          let json = null;
  
          try {
            json = JSON.parse(this.response);
          } catch (e) {
            console.error(
              'Lizard-api-client could not parse expected JSON result;',
              'request=', url, 'response=', this.response, 'error=', e);
          }
  
          resolve(json);
        } else {
          reject(`Status ${this.status}, '${this.statusText}' for URL ${url}.`);
        }
      };
      
      request.withCredentials = true; // Send cookie.
      request.open('GET', url);
      request.send();
    });
  }

  constructGetFeatureInfoUrl(mapLayer, mapRef, latlng) {
    // the url to the wms layer is originally absolute, but it is to a different domain
    // browser does not allow this due to CORS
    // therefore we prepend /proxy/ to the url so it will be send to lizard and lizard will know that it should proxy it
    const layerUrl = '/proxy/'+ mapLayer.url;
    const layerName = mapLayer.name;
    const srs = mapLayer.srs;
    const size = mapRef.getSize();
    const bbox = mapRef.getBounds().toBBoxString();
    const point = mapRef.latLngToContainerPoint(latlng, mapRef.getZoom());

    /*
    http://localhost:3002/proxy/https://maps1.project.lizard.net/geoserver/parkstad/wms?REQUEST=GetFeatureInfo&SERVICE=WMS&SRS=EPSG%3A4326&VERSION=1.1.1&INFO_FORMAT=application%2Fjson&BBOX=5.861206054687501%2C50.8984858728154%2C6.099128723144532%2C51.028224127981915&HEIGHT=600&WIDTH=693&LAYERS=r0262_resultaten_workshopronde2_oplossingsrichtingen_20180228&QUERY_LAYERS=r0262_resultaten_workshopronde2_oplossingsrichtingen_20180228&FEATURE_COUNT=100
    
    https://maps1.project.lizard.net/
    geoserver/s0175_ijgenzon/wms?
    REQUEST=GetFeatureInfo&
    SERVICE=WMS&
    SRS=EPSG%3A4326&
    VERSION=1.1.1&
    INFO_FORMAT=application%2Fjson&
    BBOX=5.84026336669922%2C50.89870240470785%2C6.110801696777345%2C51.02844005602989&
    HEIGHT=600&
    WIDTH=788&
    LAYERS=r0262_resultaten_workshopronde2_oplossingsrichtingen_20180228&
    QUERY_LAYERS=r0262_resultaten_workshopronde2_oplossingsrichtingen_20180228&
    FEATURE_COUNT=100
    &X=315
    &Y=422
    //*/

    return (
      layerUrl +
      L.Util.getParamString(
        {
          request: "GetFeatureInfo",
          service: "WMS",
          // // Why does this only seem to yield results with EPSG:4326 ?
          // // srs of layer specifies it otherwise..
          // srs: srs,
          srs: "EPSG:4326",
          version: "1.1.1", // I don't get results with 1.3.0 for some reason
          info_format: "application/json",
          bbox: bbox,
          height: size.y,
          width: size.x,
          layers: layerName,
          query_layers: layerName,
          // Return multiple features of a layer if the layer has multiple
          // features on the same location.
          // http://docs.geoserver.org/latest/en/user/services/wms/reference.html
          feature_count: 100,
          x: point.x,
          y: point.y
        },
        layerUrl,
        true
      )
    );
  }

  redrawPopup(event) {
    event.target.openPopup();
    event.target.update();
  }

  getFeatureInfomarker (event) {
    const latlng = event.latlng;
    const wmsLayers = (this.props.tile.wmsLayers || []);
    
    // With long loading times it may be desirable to already show the popup with a spinner
    this.setState({
      featureInfo: {
        show: true,
        latlng: latlng,
        data: null,
      }
    });
    const mapRef = this.leafletMapRef.current.leafletElement;

    // on background no getFeatureInfoPossible ? because it is not wms
    // const backgroundUrl = this.constructGetFeatureInfoUrl(
    //   {
    //     url: this.props.mapBackground.url,
    //     name: this.props.mapBackground.description,
    //     srs: "EPSG:4326",
    //   },
    //   mapRef,
    //   latlng
    // );
    // do raster have getFeatureInfo ? -> didnot find tile with raster yet to test
    // const rasterUrls = (this.props.tile.rasters || []).map(raster =>
    //   this.constructGetFeatureInfoUrl(
    //     {
    //       url: raster.url,
    //       name: raster.layers,
    //       srs: raster.srs,
    //     },
    //     mapRef,
    //     latlng
    //   )
    // );
    
    const wmsUrls = wmsLayers.map(wmsLayer =>
      this.constructGetFeatureInfoUrl(
        {
          url: wmsLayer.url,
          name: wmsLayer.layers,
          srs: wmsLayer.srs,
        },
        mapRef,
        latlng
      )
    );
    
    const wmsUrlsPromises = wmsUrls.map(url => this.getFromUrl(url)); 
    Promise.all(wmsUrlsPromises).then(promiseResults => {
      if (
        this.state.featureInfo.latlng.lat === latlng.lat &&
        this.state.featureInfo.latlng.lng === latlng.lng
        ) {
          this.setState({
            featureInfo: {
              show: true,
              latlng: latlng,
              data: promiseResults,
            }
          });
      }
    });
  }

  renderPopup ( featureInfo ) {
    const wmsLayers = (this.props.tile.wmsLayers || []);
    // layerPropertiesArray = array of array of properties per layer [[layer1property1,layer1property2],[layer2property1,layer2property2]] 
    const layerPropertiesArray = wmsLayers.map(layer=>(layer.getfeatureinfo_properties || [] ));
    const layerNameArray = wmsLayers.map(layer=>layer.feature_title_property);

    // if getfeatureinfo_properties && feature_title_property are both not configured 
    // then do not draw popup
    if (
      layerPropertiesArray.flat().length === 0 && 
      layerNameArray.filter(name => name !== undefined).length === 0
    ) {
      return null;
    }

    return (
    <Marker
      key={"get_feature_info"}
      position={[featureInfo.latlng.lat, featureInfo.latlng.lng]}
      // this icon is somehow needed in order not to show the marker default icon
      // , but instead show the popup right away
      // we use this to set an "empty" icon by setting al the sizes to 1 (pixel?)
      // leaflet however requires a image url so we pass it the lizard logo, but in practice we could use any image
      icon={L.icon({
        iconUrl: logo_lizard,
        shadowUrl: logo_lizard,
        iconSize: [1, 1], // size of the icon
        shadowSize: [1, 1], // size of the shadow
        iconAnchor: [1, 1], // point of the icon which will correspond to marker's location
        shadowAnchor: [1, 1], // the same for the shadow
        popupAnchor: [1, 1] // point from which the popup should open relative to the iconAnchor
      })}
      onAdd={event => {
        this.redrawPopup(event);
      }}
      onMove={event => {
        this.redrawPopup(event);
      }}
    >
      <Popup 
        // set "keepinview=false" because it crashed when rescaling the screen and screen became so small that marker fell of screen
        minWidth={250} keepInView={false}
        // whithout this onclose event the popup will open again after a react rerender
        onClose={()=>{
          this.setState({
            featureInfo: {
              show: false,
              latlng: null,
              data: null,
            },
          })
        }}
        onAdd={event => {
          this.redrawPopup(event);
        }}
        onMove={event => {
          this.redrawPopup(event);
        }}
        autoPanPaddingBottomRight={L.point(65, 65)}
        autoPanPaddingTopLeft={L.point(50, 65)}
      >
        <div 
          className={styles.Popup}
          style={{
            maxHeight:"100%",
            overflowY: "auto",
          }}
        >
          <span>Layers: </span>
          <div >
            <ol
              className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.LayerList}`}
            >
              {
                featureInfo.data ? 
                featureInfo.data.map((layer, index)=>
                  // somehow sometimes layer == null -> is this a failed api call ?
                  layer && this.renderPopupLayer(
                    layer, 
                    layerPropertiesArray[index],
                    layerNameArray[index]
                  )
                )
                : 
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // hardcoded 320px because most of time the content is this high
                      // is there a better solution? Maybe set height with scroll
                      height: '320px',
                    }}
                >
                  <MDSpinner size={48} />
                </div>
                
              }
            </ol>
          </div>
        </div>
      </Popup>
    </Marker>
    )
  }

  renderPopupLayer (layer, layerProperties, layerName) {
    const features = layer.features;
    return (
      <li>
        <div> 
          <div>
            <h2>{layerName}</h2>
            <span>Features: </span>
          </div>
          
          <ol
            className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.FeatureList}`}
          >
            {features.map(feature=>{
              return (
                <li>
                  <h4>
                    {feature.properties[layerName]}
                  </h4>
                  <ol
                    className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.PropertyList}`}
                  >
                    {layerProperties.map(propertyName=>{
                      return (
                        <li
                          className={dataStyles.KeyValueWrap}
                        >
                          <label
                            title={propertyName.name}
                          >
                            {propertyName.name}
                          </label>
                          <span>{feature.properties[propertyName.key] + ''}</span>
                        </li>
                      )
                    })}
                  </ol>
                </li>
              );
            })}
          </ol>
      </div>
    </li>
    );
  }

  render() {
    return this.props.isFull ? this.renderFull() : this.renderSmall();
  }

  renderFull() {
    const { tile, width, height } = this.props;

    let legend = null;

    let firstRasterUuid = null;
    let firstRaster = null;

    if (tile.rasters && tile.rasters.length > 0) {
      // Only show a legend for the first raster.
      firstRasterUuid = tile.rasters[0].uuid;
      firstRaster = getOrFetch(
        this.props.getRaster,
        this.props.fetchRaster,
        firstRasterUuid
      );
    }

    if (!firstRaster) {
      legend = (
        <Legend
          drawRaster={false}
          drawVectorIcons={this.tileHasVectors(tile)}
          tile={tile}
        />
      );
    } else {
      legend = (
        <Legend
          drawRaster={true}
          drawVectorIcons={this.tileHasVectors(tile)}
          tile={tile}
          uuid={firstRasterUuid}
          title={firstRaster.name}
          wmsInfo={firstRaster.wms_info}
          observationType={firstRaster.observation_type}
          styles={firstRaster.options.styles}
        />
      );
    }

    const wmsLayers = tile.wmsLayers
      ? tile.wmsLayers.map((layer, i) => {
          return (
            <WMSTileLayer
              key={i}
              url={layer.url}
              format={layer.format}
              layers={layer.layers}
              transparent={layer.transparent}
              width={layer.width}
              height={layer.height}
              srs={layer.srs}
              opacity={layer.opacity !== undefined ? layer.opacity : 1}
            />
          );
        })
      : null;

    return (
      <div
        className={styles.MapTileFull}
        key={"map-" + tile.id}
        style={{ width, height }}
      >
        <Map
          bounds={this.getBBox().toLeafletBounds()}
          attributionControl={false}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          boxZoom={true}
          keyboard={true}
          tap={true}
          zoomControl={false}
          attribution={false}
          className={styles.MapStyleFull}
          onClick={e=> this.getFeatureInfomarker(e)}
          ref={this.leafletMapRef}
        >
          <TileLayer url={this.props.mapBackground.url} />
          {tile.rasters
            ? tile.rasters.map(raster => this.tileLayerForRaster(raster))
            : null}
          {this.markers()}
          {
            this.state.featureInfo.show === true ?
            this.renderPopup(this.state.featureInfo)
            :
            null
          }
          
          {wmsLayers}
        </Map>
        {/* 
        Placed legend outside map, because this prevents click event on legend to trigger click event on map 
        This may be conceptually wrong
        Other solution would be to prevent bubbling
        */}
        {legend}
      </div>
    );
  }

  renderSmall() {
    const { tile } = this.props;

    const wmsLayers = tile.wmsLayers
      ? tile.wmsLayers.map((layer, i) => {
          return (
            <WMSTileLayer
              key={i}
              url={layer.url}
              format={layer.format}
              layers={layer.layers}
              transparent={layer.transparent}
              width={layer.width}
              height={layer.height}
              srs={layer.srs}
              opacity={layer.opacity !== undefined ? layer.opacity : 1}
            />
          );
        })
      : null;

    return (
      <div className={styles.MapStyleTile}>
        <Map
          bounds={this.getBBox().toLeafletBounds()}
          attributionControl={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          boxZoom={false}
          keyboard={false}
          tap={false}
          zoomControl={false}
          attribution={false}
          className={styles.MapStyleTile}
        >
          <TileLayer url={this.props.mapBackground.url} />
          {tile.rasters
            ? tile.rasters.map(raster => this.tileLayerForRaster(raster))
            : null}
          {this.markers()}
          {wmsLayers}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assets: state.assets,
    rasters: state.rasters,
    getRaster: makeGetter(state.rasters),
    alarms: state.alarms,
    timeseriesMetadata: state.timeseries,
    allTiles: getAllTiles(state),
    mapBackground: (s => {
      const current = getCurrentMapBackground(s);
      if (current) {
        return current;
      } else {
        return getConfiguredMapBackgrounds(state)[0];
      }
    })(state),
    referenceLevels: getReferenceLevels(state),
    portalBBox: getConfiguredPortalBBox(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addAsset: (assetType, id, instance) =>
      dispatch(addAsset(assetType, id, instance)),
    fetchRaster: uuid => fetchRaster(dispatch, uuid),
    updateTimeseries: timeseries =>
      dispatch(updateTimeseriesMetadata(timeseries.uuid))
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MapComponent)
);
