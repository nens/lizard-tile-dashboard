import { endpoint, request } from '../http';
import { processSingleResultResponse, processMultipleResultsResponse } from '../tools';

// Retrieve measuringstations from the API measuringstation list page.
export function getMeasuringStations(filters = {}) {
  let url = endpoint('/measuringstations/', filters);

  return request(url).then(function (results) {
    return processMultipleResultsResponse('MeasuringStation', results, url);
  });
}

export function getMeasuringStation(id) {
  let url = endpoint('/measuringstations/' + id + '/');

  return request(url).then(function (results) {
    return processSingleResultResponse('MeasuringStation', results, url);
  });
}
