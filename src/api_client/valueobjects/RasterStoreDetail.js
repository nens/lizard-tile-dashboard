import { request, endpoint } from '../http';
import { DateTime } from '../datetime';
import { definitionToRecord } from '../definitions';

// Fields from the detail page, more than from the list page
export const RasterStoreDetailDefinition = {
  // Metadata
  'metadata': 'Metadata',

  // Fields from the API
  'url': null,
  'uuid': null,

  'name': null,
  'description': null,
  'organisation': 'Organisation',
  'access_modifier': null,
  'origin': null,
  'interval': null,
  'first_value_timestamp': null,
  'last_value_timestamp': null,
  'supplier': null,
  'supplier_code': null,
  'last_modified': null,
  'observation_type': 'ObservationType',
  'wms_info': 'WmsInfo',
  'options': null
};

const RasterStoreDetailRecord = definitionToRecord(
  'RasterStoreDetail', RasterStoreDetailDefinition);

export class RasterStoreDetail extends RasterStoreDetailRecord {
  getData(filters = {}) {
    return request(endpoint('/rasters/' + this.uuid + '/data/', filters));
  }

  getTimesteps(filters = {}) {
    return request(endpoint('/rasters/' + this.uuid + '/timesteps/', filters));
  }

  getDataAtPoint(point, startDateTime, endDateTime, filters = {}) {
    const coordinates = point.coordinates;
    const defaults = {
      agg: 'average',
      geom: `POINT (${coordinates[0]} ${coordinates[1]} ${coordinates[2] || 0})`,
      rasters: this.uuid,
      srs: 'EPSG:4326',
      start: new DateTime(startDateTime).asWmsTimeParam(
        this.first_value_timestamp,
        this.last_value_timestamp),
      stop: new DateTime(endDateTime).asWmsTimeParam(
        this.first_value_timestamp,
        this.last_value_timestamp)
    };

    return request(
      endpoint('/raster-aggregates/',
               Object.assign(defaults, filters)));
  }
}
