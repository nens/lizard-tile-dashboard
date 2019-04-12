import { endpoint, request } from '../http';
import { processSingleResultResponse, processMultipleResultsResponse } from '../tools';

// Retrieve rasters from the API rasterstore list page.
export function getRasters(filters = {}) {
  let url = endpoint('/rasters/', filters);

  return request(url).then(function (results) {
    return processMultipleResultsResponse('RasterStore', results, url);
  });
}

export function getRasterDetail(uuid) {
  let url = endpoint('/rasters/' + uuid + '/');

  return request(url).then(function (data) {
    return processSingleResultResponse('RasterStoreDetail', data, url);
  });
}
