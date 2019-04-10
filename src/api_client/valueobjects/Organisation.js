import { definitionToRecord } from '../definitions';

export const OrganisationDefinition = {
  'url': null,
  'unique_id': null,
  'users_url': null,
  'name': null
};

const OrganisationRecord = definitionToRecord('Organisation', OrganisationDefinition);

export class Organisation extends OrganisationRecord {
}