// Timeseries embedded in assets are not the same format as timeseries from the
// Timeseries endpoint...

import { definitionToRecord } from '../definitions';

export const AssetTimeseriesDefinition = {
  // Metadata, filled in by http.js
  'metadata': 'Metadata',

  // Fields from the API
  'uuid': null,
  'name': null,
  'parameter': null,
  'reference_frame': null,
  'scale': null,
  'unit': null,
  'value_type': null
};

const AssetTimeseriesRecord = definitionToRecord(
  'AssetTimeseries', AssetTimeseriesDefinition);

export class AssetTimeseries extends AssetTimeseriesRecord {
}
