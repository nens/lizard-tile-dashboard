import { definitionToRecord } from '../definitions';

export const RasterAlarmDefinition = {
  // Metadata, filled in by http.js
  metadata: 'Metadata',

  // Fields from the API

  // key-value definitions { <key>: <value> ::= null | 'String' | 'String?' }
  url: null,
  uuid: null,
  name: null,
  organisation: 'Organisation',
  active: null,
  intersection: null,
  comparison: null,
  'observation_type': 'ObservationType?',
  thresholds: null,
  messages: null,
  'warning_threshold': null,
  'warning_value': null,
  'warning_timestamp': null
};

const RasterAlarmRecord = definitionToRecord(
  'RasterAlarm', RasterAlarmDefinition);

export class RasterAlarm extends RasterAlarmRecord {
  isTimeseriesAlarm() {
    // Useful in case we have a mixed list of alarms
    return false;
  }

  activeWarning() {
    // If a warning is not active right now, all the warning_ fields are null.
    return this.warning_threshold !== null;
  }

  sameIntersection(rasterUrl, geometry) {
    // Return true if the intersection of this raster alarm has the same raster URL
    // and the same geometry. Currently ignores asset intersections.
    if (!this.intersection) return false;

    if (this.intersection.raster !== rasterUrl) return false;

    return this.sameGeometry(geometry);
  }

  sameGeometry(geometry) {
    if (!this.intersection) return false;

    const thisGeom = this.intersection.geometry;

    if (!thisGeom || !geometry) return false;

    // Only check points.
    if (geometry.type !== 'Point' || thisGeom.type !== 'Point') return false;

    if (geometry.coordinates.length < 2 || thisGeom.coordinates.length < 2) return false;

    return (
      parseFloat(geometry.coordinates[0]) === parseFloat(thisGeom.coordinates[0]) &&
      parseFloat(geometry.coordinates[1]) === parseFloat(thisGeom.coordinates[1])
    );
  }
}
