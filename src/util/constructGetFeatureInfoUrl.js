import L from "leaflet";

export default function constructGetFeatureInfoUrl(mapLayer, mapRef, latlng) {
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

