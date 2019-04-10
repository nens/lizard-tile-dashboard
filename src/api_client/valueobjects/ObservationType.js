import { definitionToRecord } from '../definitions';
export const ObservationTypeDefinition = {
  // Metadata, filled in by http.js
  'metadata': 'Metadata',

  // Fields from the API
  'url': null,
  'code': null,
  'parameter': null,
  'unit': null,
  'scale': null,
  'description': null,
  'domain_values': null,
  'reference_frame': null,
  'compartment': null
};

const ObservationTypeRecord = definitionToRecord(
  'ObservationType', ObservationTypeDefinition);

export class ObservationType extends ObservationTypeRecord {
  getLegendString() {
    let legend = this.parameter;

    if (this.unit) {
      legend += ' (' + this.unit + ')';
    }
    return legend;
  }
}

export const DefaultObservationType = {
  'url': null,
  'code': 'unknown',
  'parameter': 'Unknown',
  'unit': 'unknown',
  'scale': 'ratio',
  'description': 'Placeholder for a missing observation type',
  'domain_values': null,
  'reference_frame': null,
  'compartment': null
};
