import { definitionToRecord } from '../definitions';

export const SearchResultDefinition = {
  'metadata': 'Metadata',

  // Fields from the API
  'id': null,
  'title': null,
  'description': null,
  'rank': null,
  'entity_name': null,
  'entity_id': null,
  'entity_url': null,
  'view': null
};

const SearchResultRecord = definitionToRecord('SearchResult', SearchResultDefinition);

export default class SearchResult extends SearchResultRecord {
}
