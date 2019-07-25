import React, { Component } from "react";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MDSpinner from "react-md-spinner";

import logo_lizard from "../graphics/logo-Lizard.png";
import dataStyles from "../style/Data.css";
import popupStyles from "./Popup.css";


class FeatureInfoPopup extends Component {

  redrawPopup(event) {
    event.target.openPopup();
    event.target.update();
  }

  flattenOneLayer(arr) {
    return [].concat(...arr)
  }

  render() {

    const { wmsLayers, featureInfo } = this.props;

    const { rasterData, wmsData } = featureInfo;

    // layerPropertiesArray = array of array of properties per layer [[layer1property1,layer1property2],[layer2property1,layer2property2]] 
    const layerPropertiesArray = wmsLayers.map(layer => (layer.getfeatureinfo_properties || []));
    const layerNameArray = wmsLayers.map(layer => layer.feature_title_property);

    // if getfeatureinfo_properties && feature_title_property && rasters are all not configured 
    // then do not draw popup
    if (
      this.flattenOneLayer(layerPropertiesArray).length === 0 &&
      layerNameArray.filter(name => name !== undefined).length === 0 &&
      !rasterData
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
        // Without this event appearently leaflet does not render the popup
        onAdd={event => {
          this.redrawPopup(event);
        }}
      >
        <Popup
          // set "keepinview=false" because it crashed when rescaling the screen and screen became so small that marker fell of screen
          minWidth={250} keepInView={false}
          // whithout this onclose event the popup will open again after a react rerender
          onClose={this.props.onClose}
          autoPanPaddingBottomRight={L.point(65, 65)}
          autoPanPaddingTopLeft={L.point(50, 65)}
        >
          <div
            className={popupStyles.Popup}
          >
            <div >
              <div className={popupStyles.PointLatLng}>
                <i className="fa fa-map-marker" />
                <div>
                  <span>({featureInfo.latlng.lat.toFixed(5)}, {featureInfo.latlng.lng.toFixed(5)})</span><br />
                  <span>geometrie</span>
                </div>
              </div>
              <ol
                className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.LayerList}`}
              >
                {
                  rasterData ?
                    rasterData.map((rasterLayer, index) =>
                      //Keep the index to track of the raster
                      rasterLayer && this.renderPopupLayerForRaster(
                        rasterLayer.data,
                        index
                      )
                    )
                    :
                    null
                }
                {
                  wmsData ?
                    wmsData.map((layer, index) =>
                      // somehow sometimes layer == null -> is this a failed api call ?
                      layer && this.renderPopupLayerForWMS(
                        layer,
                        layerPropertiesArray[index],
                        layerNameArray[index]
                      )
                    )
                    :
                    null

                }
              </ol>
              {!wmsData && !rasterData ?
                <div
                  className={popupStyles.SpinnerContainer}
                >
                  <MDSpinner size={48} />
                </div>
                :
                null
              }
            </div>
          </div>
        </Popup>
      </Marker>
    )
  }

  renderPopupLayerForWMS(layer, layerProperties, layerName) {
    const features = layer.features;
    return (
      <li>
        <div>
          <div>
            <h2>{layerName}</h2>
          </div>

          <ol
            className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.FeatureList}`}
          >
            {features.map(feature => {
              return (
                <li>
                  <h4>
                    {feature.properties[layerName]}
                  </h4>
                  <ol
                    className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.PropertyList}`}
                  >
                    {layerProperties.map(propertyName => {
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

  renderPopupLayerForRaster(data, index) {
    const { rasters } = this.props;
    //Get the raster from the rasters array by using its index number
    let raster = rasters[index];

    const renderRasterInfo = (data) => {
      if (raster.temporal === false) {
        //This is a non-temporal raster
        if (raster.aggregation_type === "counts") {
          return (
            //if aggregation type is counts then show the label of the layer clicked on
            //as data is an array of only one object (with the values inside this object) so we use index number 0 to get data from this object
            <p title="label">{data[0].label}</p>
          )
        } else {
          return (
            //in all other cases (aggregation === "curve" or "sum" or "none"), data contains the value of the raster already
            //so we show the value of the raster at the selected point
            <p title="value">{raster.observation_type.parameter}: {data[0] && data[0].toFixed(3)} {raster.observation_type.unit}</p>
          )
        }
      } else {
        //This is when the raster is temporal (raster.temporal === true)
        return (
          //when the raster is temporal, we need to figure out how to display data in this case to make it useful
          //for now just simply show the data value of the most recent time
          <p title="value">{raster.observation_type.parameter}: {data[1] && data[1][1] && data[1][1].toFixed(2)} {raster.observation_type.unit}</p>
        )
      }
    }

    return (
      <li key={raster.uuid} className={dataStyles.KeyValueWrap}>
        <h3>{raster.name}</h3>
        {renderRasterInfo(data)}
      </li>
    );
  }

}

export default FeatureInfoPopup;
