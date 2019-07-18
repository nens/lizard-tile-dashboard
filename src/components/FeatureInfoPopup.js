import React, { Component } from "react";

import L from "leaflet";
import {Marker, Popup} from "react-leaflet";
import MDSpinner from "react-md-spinner";

import logo_lizard from "../graphics/logo-Lizard.png";
import dataStyles from "../style/Data.css";
import popupStyles from "./Popup.css";


class FeatureInfoPopup extends Component {

  redrawPopup(event) {
    event.target.openPopup();
    event.target.update();
  }

  flattenOneLayer (arr) {
    return [].concat(...arr)
  }

  render () {

    const {wmsLayers, featureInfo} = this.props;
    // layerPropertiesArray = array of array of properties per layer [[layer1property1,layer1property2],[layer2property1,layer2property2]] 
    const layerPropertiesArray = wmsLayers.map(layer=>(layer.getfeatureinfo_properties || [] ));
    const layerNameArray = wmsLayers.map(layer=>layer.feature_title_property);

    // if getfeatureinfo_properties && feature_title_property are both not configured 
    // then do not draw popup
    if (
      this.flattenOneLayer(layerPropertiesArray).length === 0 && 
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
                null
                
              }
            </ol>
            { !featureInfo.data ? 
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

  renderPopupLayer (layer, layerProperties, layerName) {
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

}

export default FeatureInfoPopup;
