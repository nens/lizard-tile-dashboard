import { Record } from 'immutable';

const MetadataRecord = new Record({
  'sourceUrl': null,
  'index': null,
  'retrieved': null
}, 'Metadata');

export default class Metadata extends MetadataRecord {
}
