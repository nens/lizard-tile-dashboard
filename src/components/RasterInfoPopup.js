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
                            <div className={rasterPopupStyles.PointLatLng}>
                                <i className="fa fa-map-marker" />
                                <div>
                                    <span>({featureInfo.latlng.lat.toFixed(5)}, {featureInfo.latlng.lng.toFixed(5)})</span><br/>
                                    <span>geometrie</span>
                                </div>
                            </div>
                            <ol
                                className={`${dataStyles.HideListDesign} ${popupStyles.List} ${popupStyles.LayerList}`}
                            >
                                {
                                    featureInfo.data ?
                                        featureInfo.data.map((rasterLayer, index) =>
                                            //Keep the index to track of the raster
                                            rasterLayer && this.renderPopupLayer(
                                                rasterLayer.data,
                                                index
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

    renderPopupLayer(rasterLayer, index) {
        const { rasters } = this.props;
        //Get the raster from the rasters array by using its index number
        let raster = rasters[index];

        return (
            <li key={raster.uuid} className={dataStyles.KeyValueWrap}>
                <h3>{raster.name}</h3>
                {raster.aggregation_type === "counts" ?
                    //if aggregation type is counts then show the label of the layer clicked on
                    //rasterLayer is an array of only one object (with the values inside this object) so we use index number 0 to get data from this object
                    <p title="label">{rasterLayer[0].label}</p> :
                    //if aggregation type is curve then show the value of the parameter of observation type at the selected point
                    //in this case rasterLayer contains the value of the raster already
                    <p title="value">{raster.observation_type.parameter}: {rasterLayer} {raster.observation_type.unit}</p>
                    //still missing the case of temporal raster
                }
            </li>
        );
    }
}

export default RasterInfoPopup;
