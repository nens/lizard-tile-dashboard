import { request, insertGetParam, combineUrlAndParams } from '../http';
import { DateTime } from '../datetime';
import { definitionToRecord } from '../definitions';
import { processSingleResultResponse } from '../tools';

export const WmsInfoDefinition = {
  'layer': null,
  'endpoint': null,
  'example_url': null
};

const WmsInfoRecord = definitionToRecord('WmsInfo', WmsInfoDefinition);

export class WmsInfo extends WmsInfoRecord {
  addTimeToEndpoint(date, start, end) {
    return insertGetParam(
      this.endpoint,
      'TIME',
      new DateTime(date).asWmsTimeParam(start, end));
  }

  getLimits(leafletLatLngBounds, width = 256, height = 256, params = {}) {
    // Leaflet array looks like [[southwest-lat, southwest-lng],
    // [northeast-lat, northeast-lng]].
    // Pass a CRS if version is 1.3.0, or a SRS if version is 1.1.1.

    params.request = 'getlimits';

    if (!('version' in params)) {
      params.version = '1.1.1';
    }

    // See e.g. https://viswaug.wordpress.com/2009/03/15/reversed-co-ordinate-axis-order-for-epsg4326-vs-crs84-when-requesting-wms-130-images/
    // for an explanation...
    if (params.version === '1.1.1') {
      if (!('srs' in params)) {
        params.srs = 'EPSG:4326'; // WGS84, "lat/lon"
      }
    } else {
      if (!('crs' in params)) {
        params.crs = 'CRS:84'; // Also WGS84!
      }
    }
    if (!('layers' in params)) {
      params.layers = this.layer;
    }
    params.bbox = leafletLatLngBounds.toBBoxString();
    params.width = width;
    params.height = height;

    const url = combineUrlAndParams(this.endpoint, params);

    return request(url);
  }

  getLegend(styles, steps = 10) {
    const params = {
      service: 'wms',
      request: 'getlegend',
      layer: this.layer,
      steps: steps,
      style: styles
    };

    const url = combineUrlAndParams(this.endpoint, params);

    return request(url).then(function (data) {
      return processSingleResultResponse('LegendData', data, url);
    });
  }
}
