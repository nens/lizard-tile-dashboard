Lizard-Tile-Configuration
=========================

This is a fully configurable dashboard app.  
Users can define themselves what each dashboard will show and are able to define multiple dashboards with each their own url.  
Users will be able to do so in the "client_configuration" admin page of the lizard-nxt application: "/admin/lizard_nxt/clientconfiguration".  
Below screenshot is an example of such a record.  
  
![alt text](./client_config_screenshot.png "Screenshot of client configuration record in DJANGO admin")  
  
- The "portal" field defines the base url of the dashboard  
- The "slug" field defines the postfix of the url  
- The configuration field defines the content of the dashboard and will be explained further under "The configuration field"  

The url to acces the configured dashboard always has the format:  
`<portal>/`dashboard`/<slug>`  
For legacy reasons there is an exception to this, namely:  
If the "slug" field has the value "dashboard" then the app can also be accessed via the url:  
`<portal>/`dashboard`/`  

The example in above screenshot would thus be accessable via the url:
[https://china.lizard.net/dashboard/view1](https://china.lizard.net/dashboard/view1)

The configuration field
=======================

The "configuration" field defines the content of the dashboard in a [JSON format](https://www.json.org/).  
A dashboard typically contains of: 

  
  - meta-properties
  - tiles, each tile is of one of the follwoing types:   
    - a geographical map, implemented in [Leaflet](https://leafletjs.com/)
    - a temporal graph, implemented in [Plotly](https://plot.ly/javascript/)
    - other media type (image, gif, etc)


Tiles
=====

Each dashboard can contain one or more tiles.  
Tiles are the little squares on the main page.  
Within the dashboard app, each tile has unique content and can be made fullscreen by clicking on it.  
Since there are multiple tiles per dashboards the tiles are defined in the JSON format with an [array](https://www.w3schools.com/js/js_json_arrays.asp).  
Each element of this tile array is itself a [JSON object](https://www.w3schools.com/js/js_json_objects.asp) defining the content of the respective tile.  

Below is an example.   
CAUTION ! Please be aware that comments are not valid JSON and should be removed before using below example in real life:  


``` javascript
  "tiles": [
    { 
      // Example of a map tile
      "shortTitle": "Example of map tile",
      "title": "Example of map tile",
      "type": "map",
      "id": 1,
      "rasters": [
        {
          "opacity": "1",
          "uuid": "cbcb087"
        }
      ],
      "datetime": {
        "to": "now",
        "type": "relative",
        "offset": 0,
        "modulo": 300
      },
      "bbox": [
        "87.83",
        "26.92",
        "93.37",
        "21.82"
      ]
    },
    {
      // example of a timeseries tile
      "title": "Example timeseries tile",
      "type": "Example timeseries tile",
      "id": 17,
      "periodHoursRelativeToNow": [
        -7,
        3
      ],
      "legendStrings": [
        "Toongabbie water level"
      ],
      "colors": [
        "#26A7F1",
        "#000058"
      ],
      "timeseries": [
        "1b7843d"
      ],
      "legend": {
        "bgcolor": "rgba(255, 255, 255, 0.25)",
        "font": {
          "family": "Futura, monospace",
          "size": 17,
          "color": "purple"
        }
      }
    },
    {
      // example of a image tile
      "title": "Overzicht Twentekanaal Hoogeveense Vaart",
      "url": "https://ijgenzon.lizard.net/media/ijgenzon/Overzicht_TK_HV.png",
      "imageUrl": "https://ijgenzon.lizard.net/media/ijgenzon/Overzicht_TK_HV.png",
      "renderAsImage": true,
      "type": "external",
      "id": 15
    },
  ],
```

Meta-properties
===============

Meta-properties define constatnts that are identical for all tiles on the dashboard.  
Some of these properties can only be defined as meta-properties, but others may also be defined per tile.  
In the latter case properties on tile-level will always take precedence over properties on meta-level.  
Properties that only exist on tile level and not on meta-level also exist and are in fact the majority.  

Properties
==========

Below is a non-exhaustive list of properties.  
Please help by extending this list.


| Property name | What it does | Required | where it is defined |
|----------|:-------------:|--------:|------:|
| nowDateTimeUTC |  Defines the current time of the dashboard. If defined then gaugae data will nog get updated | No, defaults to current date/time | on root level of JSON |
| isPublic | If true then the user does not need to login to open the dashboard | No, defaults to false | on root level op JSON |












