import { definitionToRecord } from '../definitions';

// Legend Data is retrieved by a 'getlegend' WMS request to the raster server,
// not through the conventional API.
export const LegendDataDefinition = {
  metadata: 'Metadata',
  log: null, // boolean, is this a log-value colormap?
  limits: null, // array with two values, min and max values used to create the legend
  labels: null, // IF this is a discrete colormap, hash that connects numbers to labels
  colormap_type: null, // 'gradient' or 'discrete'
  name: null, // name of the colormap
  legend: null // List of dictionaries that have a color '#ffffff' string and a value
};

const LegendDataRecord = definitionToRecord('LegendData', LegendDataDefinition);

// Subclass that defines helper methods.
export class LegendData extends LegendDataRecord {
  // TODO Helper functions for nice rounding of values etc go here.
}
