import { endpoint, request } from '../http';
import { processMultipleResultsResponse } from '../tools';

// Retrieve timeseries from the timeseries API
export function getTimeseries(timeseriesUuid, start, end, params) {
  let parameters = {};

  if (params) {
    Object.assign(parameters, params);
  }
  parameters.uuid = timeseriesUuid;

  if (start && end) {
    parameters.start = start;
    parameters.end = end;
  };

  let url = endpoint('/timeseries/', parameters);

  return request(url).then((result) => {
    return processMultipleResultsResponse('Timeseries', result, url);
  });
}
