import React, { Component } from "react";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MDSpinner from "react-md-spinner";

import logo_lizard from "../graphics/logo-Lizard.png";
import dataStyles from "../style/Data.css";
import popupStyles from "./Popup.css";
import rasterPopupStyles from "./RasterInfoPopup.css";

class RasterInfoPopup extends Component {

    redrawPopup(event) {
        event.target.openPopup();
        event.target.update();
    }

    flattenOneLayer(arr) {
        return [].concat(...arr)
    }

    render() {

        const { featureInfo } = this.props;
        
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
                                        featureInfo.data[0].data.map(layer =>
                                            layer && this.renderPopupLayer(
                                                layer
                                            )
                                        )
                                        :
                                        null

                                }
                            </ol>
                            {!featureInfo.data ?
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

    renderPopupLayer(layer) {
        const { featureInfo, raster } = this.props;
        
        return (
            <li>
                <h2>{raster.name}</h2>
                {raster.aggregation_type === "counts" ? 
                    //if aggregation type is counts then show the label of the layer clicked on
                    <h3>Label: {layer.label}</h3> :
                    //if aggregation type is curve then show the value of the parameter of observation type at the selected point
                    <h3>{raster.observation_type.parameter}: {layer[0]} {raster.observation_type.unit}</h3>
                    //still missing the case of temporal raster
                }
                <div className={rasterPopupStyles.PointLatLng}>
                    <i className="fa fa-map-marker" />
                    <div>
                        <p>({featureInfo.latlng.lat.toFixed(5)}, {featureInfo.latlng.lng.toFixed(5)})</p>
                        <p>geometrie</p>
                    </div>
                </div>
            </li>
        );
    }
}

export default RasterInfoPopup;
