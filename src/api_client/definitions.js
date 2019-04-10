import { Record } from 'immutable';

export function definitionToRecord(recordName, definition) {
  // Create object with keys of definition and 'null' values. All object types have a
  // 'metadata' key.
  let record = { 'metadata': null };

  for (const prop in definition) {
    if (definition.hasOwnProperty(prop)) {
      record[prop] = null;
    }
  }

  // Return an immutable.js Record
  return new Record(record, recordName);
}
