import { definitionToRecord } from '../definitions';

export const TimeseriesAlarmDefinition = {
  // Metadata, filled in by http.js
  metadata: 'Metadata',

  // Fields from the API
  url: null,
  uuid: null,
  name: null,
  organisation: 'Organisation',
  active: null,
  timeseries: null,
  comparison: null,
  'observation_type': 'ObservationType',
  thresholds: null,
  'warning_threshold': null,
  'warning_value': null,
  'warning_timestamp': null
};

const TimeseriesAlarmRecord = definitionToRecord(
  'TimeseriesAlarm', TimeseriesAlarmDefinition);

export class TimeseriesAlarm extends TimeseriesAlarmRecord {
  isTimeseriesAlarm() {
    // Useful in case we have a mixed list of alarms
    return true;
  }

  activeWarning() {
    // If a warning is not active right now, all the warning_ fields are null.
    return this.warning_threshold !== null;
  }

  belongsToAsset(asset) {
    // Asset is any valueobject that has a getTimeseriesByUuid method!
    return this.timeseries && !!(asset.getTimeseriesByUuid(this.timeseries.uuid));
  }
}
