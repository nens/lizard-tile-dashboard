import { endpoint, request } from '../http';
import SearchResult from '../valueobjects/SearchResult';

import { processSingleFeature } from '../tools';

const DEFAULT_SRID = 4326;

export function search(q, type = null, exclude = [], extraParams = {}) {
  let params = {
    'q': q
  };

  if (type) {
    params.type = type;
  }

  if (exclude && exclude.length) {
    params.exclude = exclude.join();
  }

  for (const key in extraParams) {
    params[key] = extraParams[key];
  }

  const url = endpoint('/search/', params);

  return request(url).then(
    data => data.results.map(result => new SearchResult(result))
  );
}

export function searchParcels(q, bbox) {
  const extraParams = {};

  if (bbox) {
    extraParams.in_bbox = bbox;
    extraParams.srid = DEFAULT_SRID;
  }
  return search(q, 'parcel', [], extraParams).then(
    searchResults => {
      const listOfPromises = searchResults.map(result =>
        request(result.entity_url)
      );

      return Promise.all(listOfPromises).then(allPromisesData =>
        allPromisesData.map((result, index) =>
          processSingleFeature('Parcel', result, searchResults[index].entity_url)
        )
      );
    }
  );
};
