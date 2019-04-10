import Metadata from './valueobjects/Metadata';
import { valueObjects, valueObjectDefinitions,
         valueObjectDefaults} from './valueobjects/index';

const processingFunctions = {
  listOfAssetTimeseries: (results) => results.map(
    (result) => processSingleResultResponse('AssetTimeseries', result))
};

export function processSingleResultResponse(objectType, result, url) {
  // Process a single result from a normal API response
  const ValueObject = valueObjects[objectType];
  const definition = valueObjectDefinitions[objectType];
  const processedResult = {};

  for (const item in definition) {
    if (!definition.hasOwnProperty(item)) {
      // 'toString' and such
      continue;
    }

    let def = definition[item];

    if (def === 'Metadata') {
      // Add it and continue the loop.
      if (result[item]) {
        processedResult[item] = result[item];
      } else {
        processedResult[item] = new Metadata({
          'sourceUrl': url,
          'index': null,
          'retrieved': Date.now()
        });
      }
    } else if (!def) {
      // Definition is 'null' or empty string -- we copy the value as is.
      if (result.hasOwnProperty(item)) {
        // Copy value from 'result':
        processedResult[item] = result[item];
      } else {
        console.error(`Expected to find key '${item}' in result.`, result);
      }
    } else {
      // If it ends with a question mark, it's optional.
      let optional = /\?$/.test(def);

      if (optional) {
        def = def.slice(0, -1); // Remove question mark
      }

      if (!result.hasOwnProperty(item) || result[item] === null) {
        // It's missing.
        if (optional) {
          // ...and that is OK. Put null and we are done.
          processedResult[item] = null;
          continue;
        } else if (valueObjectDefaults.hasOwnProperty(def)) {
          // Is there a default? Then copy it into the result and carry on.
          result[item] = Object.assign({}, valueObjectDefaults[def]);
        } else {
          throw new Error(
            'No value found for required item ' + def + ' from ' + url);
        }
      }

      // Do something with the definition
      if (processingFunctions.hasOwnProperty(def)) {
        // Name of a function, e.g. to process timestamps.
        processedResult[item] = processingFunctions[def](result[item]);
      } else {
        // It's a sub-object, recurse.
        processedResult[item] = processSingleResultResponse(def, result[item]);
      }
    }
  }

  return new ValueObject(processedResult);
}

export function processMultipleResultsResponse(objectType, json, url) {
  // Process a list of results from a response that has a 'results' array
  if (!json || !json.results) {
    return [];
  }

  return json.results.map(function (result, idx) {
    result.metadata = new Metadata({
      'sourceUrl': url,
      'index': idx,
      'retrieved': Date.now()
    });

    return processSingleResultResponse(objectType, result);
  });
}

export function processSingleFeature(objectType, json, url) {
  // Process a single result from a rest_framework_gis serializer
  if (!json || !json.properties || json.type !== 'Feature') {
    return null;
  }

  const result = json.properties;

  result.metadata = new Metadata({
    'sourceUrl': url,
    'index': null,
    'retrieved': Date.now()
  });

  result.geometry = json.geometry;
  result.id = json.id;

  return processSingleResultResponse(objectType, result);
}

export function processFeatureCollection(objectType, json, url) {
  // Process a list of results from a rest_framework_gis serializer
  if (!json || !json.results || json.results.type !== 'FeatureCollection') {
    return [];
  }

  return json.results.features.map(function (feature, idx) {
    const result = feature.properties;

    result.metadata = new Metadata({
      'sourceUrl': url,
      'index': idx,
      'retrieved': Date.now()
    });

    result.geometry = feature.geometry;
    result.id = feature.id;

    return processSingleResultResponse(objectType, result);
  });
}

export function flatten(ob) {
  const toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) === 'object') {
      const flatObject = flatten(ob[i]);

      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};
