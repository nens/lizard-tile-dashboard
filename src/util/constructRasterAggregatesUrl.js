// import L from "leaflet";

export default function constructRasterAggregatesUrl(raster, latlng) {

    //For non-temporal rasters
    const layerUrl = '/api/v3/raster-aggregates/?';
    const aggType = raster.aggregation_type;
    const srs = 'EPSG:4326';
    const styles = raster.options.styles;
    const shortUuid = raster.uuid.substr(0, 7)

    //For temporal rasters, need to include start & stop values
    //stop value is current date and start value is 2 days ago from current date
    const stop = new Date();
    const start = new Date(stop - 2 * 24 * 60 * 60 * 1000);

    //Formate date & time into ISO format which is YYYY-MM-DDTHH:mm:ss.sssZ
    const startTime = start.toISOString();
    const stopTime = stop.toISOString();

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

    return `${layerUrl}agg=${aggType}&geom=POINT+(${latlng.lng}+${latlng.lat})&rasters=${shortUuid}&srs=${srs}&styles=${styles}&start=${startTime}&stop=${stopTime}`;
};