// import L from "leaflet";

export default function constructRasterAggregatesUrl(raster, latlng) {

    //For non-temporal rasters
    const layerUrl = '/api/v3/raster-aggregates/?';
    const aggType = raster.aggregation_type;
    const srs = 'EPSG:4326';
    const styles = raster.options.styles;
    const shortUuid = raster.uuid.substr(0, 7)

    //For temporal rasters, need to include start & stop values
    const start = new Date(raster.first_value_timestamp);
    const stop = new Date(raster.last_value_timestamp);

    //Formate date & time in the format of YYYY-MM-DDTHH:MM:SS
    const startTime = start.toLocaleDateString().split(/\//).reverse().join('-') + 'T' + start.toLocaleTimeString()
    const stopTime = stop.toLocaleDateString().split(/\//).reverse().join('-') + 'T' + stop.toLocaleTimeString()

    /*
    https://nxt3.staging.lizard.net/api/v3/raster-aggregates/?agg=curve&geom=POINT+(5.19+52.27)&rasters=f3e3c9c&srs=EPSG:4326&styles=dem_nl
    
    https://nxt3.staging.lizard.net/api/v3/
    raster-aggregates/?
    agg=curve&
    geom=POINT+(5.19+52.27)&
    rasters=f3e3c9c&
    srs=EPSG:4326&
    styles=dem_nl
    */
    return `${layerUrl}agg=${aggType}&geom=POINT+(${latlng.lng}+${latlng.lat})&rasters=${shortUuid}&srs=${srs}&styles=${styles}&start=${startTime}&stop=${stopTime}`
}