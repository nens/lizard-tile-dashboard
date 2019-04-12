import { definitionToRecord } from '../definitions';
import { getTimeseries } from '../endpoints/timeseries';

export const TimeseriesDefinition = {
  // Metadata, filled in by http.js
  'metadata': 'Metadata',

  // Fields from the API
  'uuid': null,
  'name': null,
  'start': null,
  'end': null,
  'events': null,
  'observation_type': 'ObservationType',
  'last_value': null
};

const TimeseriesRecord = definitionToRecord(
  'Timeseries', TimeseriesDefinition);

export class Timeseries extends TimeseriesRecord {
  getEvents(start, end, window = null, minPoints = null) {
    const params = {};

    if (window) {
      params.window = window;

      if (this.observation_type.scale === 'ratio') {
        params.fields = 'mean';
      }
    } else if (minPoints) {
      params['min_points'] = minPoints;
    }

    return getTimeseries(this.uuid, start, end, params);
  }
}
