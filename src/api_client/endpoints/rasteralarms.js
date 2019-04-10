import { endpoint, request } from '../http';
import { processMultipleResultsResponse } from '../tools';

export function getRasterAlarms(filters = {}) {
  let url = endpoint('/rasteralarms/', filters);

  return request(url).then(function (results) {
    return processMultipleResultsResponse('RasterAlarm', results, url);
  });
}
