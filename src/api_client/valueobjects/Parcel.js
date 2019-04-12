import { definitionToRecord } from '../definitions';

// Definition of the fields that a RasterStore from the list view has.
export const ParcelDefinition = {
  'metadata': 'Metadata',

  // Fields from the API
  'organisation': 'Organisation',
  'code': null,
  'name': null,
  'external_id': null,
  'geometry': null,
  'id': null
};

const ParcelRecord = definitionToRecord('Parcel', ParcelDefinition);

// Subclass that defines helper methods.
export class Parcel extends ParcelRecord {
}
