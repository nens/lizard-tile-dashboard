import { definitionToRecord } from '../definitions';
import { addGetParameter } from '../urls';

export const BootstrapDefinition = {
  'metadata': 'Metadata',
  'username': null,
  'first_name': null,
  'authenticated': null,
  'login': null,
  'logout': null,
  'state': null, // TODO Should probably be processed
  'configuration': null // For individual clients
};

const BootstrapRecord = definitionToRecord('Bootstrap', BootstrapDefinition);

export class Bootstrap extends BootstrapRecord {
  doLogout() {
    window.location = addGetParameter(
      this.logout, 'next', window.location.href);
  }

  doLogin() {
    window.location = addGetParameter(
      this.login, 'next', window.location.href);
  }

  getBounds() {
    // Return a copy of this.state.spatial.bounds, if present
    if (!this.state || !this.state.spatial || !this.state.spatial.bounds) {
      return null;
    }
    return {
      _southWest: this.state.spatial.bounds._southWest,
      _northEast: this.state.spatial.bounds._northEast
    };
  }
}
