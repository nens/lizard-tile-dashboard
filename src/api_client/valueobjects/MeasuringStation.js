import { definitionToRecord } from '../definitions';

export const MeasuringStationDefinition = {
  'metadata': 'Metadata',

  'url': null,
  'id': null,
  'timeseries': 'listOfAssetTimeseries',
  'image_url': null,
  'code': null,
  'name': null,
  'region': null,
  'station_type': null,
  'category': null,
  'frequency': null,
  'geometry': null
};

const MeasuringStationRecord = definitionToRecord(
  'MeasuringStation', MeasuringStationDefinition);

export class MeasuringStation extends MeasuringStationRecord {
  getTimeseriesByUuid(uuid) {
    // Return the AssetTimeseries belonging to this asset that has UUID,
    // or undefined if it isn't found.
    for (let i = 0; i < this.timeseries.length; i++) {
      const timeseries = this.timeseries[i];

      if (timeseries.uuid === uuid) {
        return timeseries;
      }
    }
    // Not found
    return undefined;
  }
}
