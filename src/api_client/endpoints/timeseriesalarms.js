import { endpoint, request } from '../http';
import { processMultipleResultsResponse } from '../tools';

export function getTimeseriesAlarms(filters = {}) {
  let url = endpoint('/timeseriesalarms/', filters);

  return request(url).then(function (results) {
    return processMultipleResultsResponse('TimeseriesAlarm', results, url);
  });
}
