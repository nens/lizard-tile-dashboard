import { endpoint, request } from '../http';
import { processFeatureCollection } from '../tools';

// Retrieve rasters from the API rasterstore list page.
export function getParcels(filters = {}) {
  let url = endpoint('/parcels/', filters);

  return request(url).then(function (results) {
    return processFeatureCollection('Parcel', results, url);
  });
}

export function getParcelsByName(namePart) {
  return getParcels({'name__icontains': namePart});
}
