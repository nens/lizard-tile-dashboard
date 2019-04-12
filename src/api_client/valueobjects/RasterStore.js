import { DateTime } from '../datetime';
import { request, endpoint } from '../http';
import { definitionToRecord } from '../definitions';

// Definition of the fields that a RasterStore from the list view has.
export const RasterStoreDefinition = {
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
  'observation_type': 'ObservationType'
};

const RasterStoreRecord = definitionToRecord('RasterStore', RasterStoreDefinition);

// Subclass that defines helper methods.
export class RasterStore extends RasterStoreRecord {
  getData(filters = {}) {
    return request('/rasters/' + this.uuid + '/data/', filters);
  }

  getTimesteps(filters = {}) {
    return request('/rasters/' + this.uuid + '/timesteps/', filters);
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
        this.last_value_timestamp),
      window: 3600000
    };

    return request(
      endpoint('/raster-aggregates/',
               Object.assign(defaults, filters)));
  }
}
