// import L from "leaflet";

export default function constructRasterAggregatesUrl(raster, latlng) {

    //For non-temporal rasters
    const layerUrl = '/api/v3/raster-aggregates/?';
    const aggType = raster.aggregation_type;
    const srs = 'EPSG:4326';
    const styles = raster.options.styles;
    const shortUuid = raster.uuid.substr(0, 7)

    //For temporal rasters, need to include start & stop values
    //stop value is 1 day ago and start value is 3 days ago from current date
    const currentDate = new Date();
    const stop = new Date(currentDate - 1 * 24 * 60 * 60 * 1000);
    const start = new Date(currentDate - 3 * 24 * 60 * 60 * 1000);

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