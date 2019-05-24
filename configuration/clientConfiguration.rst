================================================================
Lizard-Tile-Dashboard Configuration and Parramatta-Configuration
================================================================

For properties and configuration that are only used in the Parramatta Dashboard, see `Parramatta Dashboard Technical Documentation <https://github.com/nens/parramatta-dashboard/blob/master/clientConfiguration/clientConfiguration.rst>`_.
Properties that are discussed here and can be used only in the Lizard Tile Dashboards have '(Lizard Tile Dashboard)' after the property name.

.. contents:: Table of Contents
   :local:

In this folder, some examples are shown for the client configuration in the admin.
The jsons in this folder contain the code per example mentioned below.


------------
Introduction
------------

This is a fully configurable dashboard app.
Users can define themselves what each dashboard will show and are able to define multiple dashboards with each their own url.
Users will be able to do so in the "client_configuration" admin page of the lizard-nxt application: "/admin/lizard_nxt/clientconfiguration".
Below screenshot is an example of such a record.

.. image:: client_config_screenshot.png
  :alt: Screenshot of client configuration record in DJANGO admin

- The "portal" field defines the base url of the dashboard
- The "slug" field defines the postfix of the url
- The configuration field defines the content of the dashboard and will be explained further under "The configuration field"

The url to acces the configured dashboard always has the format:
`<portal>/`dashboard`/<slug>`
For legacy reasons there is an exception to this, namely:
If the "slug" field has the value "dashboard" then the app can also be accessed via the url:
`<portal>/`dashboard`/`

The example in above screenshot would thus be accessable via the url:
`https://china.lizard.net/dashboard/view1 <https://china.lizard.net/dashboard/view1>`_


---------------------------------
The configuration field explained
---------------------------------

The "configuration" field defines the content of the dashboard in a `JSON format <https://www.json.org/>`_.
A dashboard typically contains of a `meta` and a `tiles` property:

- meta
- tiles, each tile is of one of the following types:

  - *map*: a geographical map, implemented in `Leaflet <https://leafletjs.com/>`_
  - *timeseries*: a temporal graph, implemented in `Plotly <https://plot.ly/javascript/>`_
  - *external*: other media type (image, gif, etc)

Optionally the following properties can also be present:

- isPublic - Boolean, if this is `true` then login is not required.
- referenceLevels - to show a reference level field for assets on a Map
- fakeData - for training purposes, some API responses can be 'faked'

The JSON stored in the admin is hard to edit because all formatting is lost. It can be made neater with online tools like `https://jsoneditoronline.org/ <https://jsoneditoronline.org/>`_.

------------------------
Tiles property explained
------------------------

Each dashboard can contain one or more tiles.
Tiles are the little squares on the main page.
Within the dashboard app, each tile has unique content and can be made fullscreen by clicking on it.
Since there are multiple tiles per dashboards the tiles are defined in the JSON format with an `array <https://www.w3schools.com/js/js_json_arrays.asp>`_ of objects.
Each element of this tile array is itself a `JSON object <https://www.w3schools.com/js/js_json_objects.asp>`_ defining the content of the respective tile.

Below is an example.
CAUTION ! Please be aware that comments are not valid JSON and should be removed before using below example in real life.::

  "tiles": [
    {
      // Example of a map tile
      "type": "map",
      "shortTitle": "Example of map tile",
      "title": "Example of map tile",
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

Common fields for all tiles
===========================

The most important property of a tile is its `type`; it decides what
other fields are used. But besides that, there are other fields that
are common to all tile types.

type
----
- Type of the tile that decides the other fields below.
- string. Currently one of "map", "timeseries", "statistics" or "external". See `Tile type: map`_, `Tile type: timeseries`_, `Tile type: statistics`_ and `Tile type: external`_.
- Mandatory

id
--
- Must be unique for each tile. To track which is currently selected.
- integer
- Mandatory
- Deprecated: this just leads to problems, we could use the index of
  the tile in the array instead.

title
-----
- The full (long) title of the tile that will be shown on the fullscreen view of the tile.
- string
- Mandatory

shortTitle
----------
- Will be used for the small versions of the tile if set, otherwise the normal title is used.
- string
- Optional

viewInLizardLink
----------------
- If set then this is linked from the header above the fullscreen version of the tile.
- string
- Optional


Tile type: map
==============

The map type tiles can show measuring stations, points and WMS layers, possibly of temporal rasters.

assetTypes
----------
- If set, all measurement stations in the map area are retrieved from the API and shown on the map as circle icons.
- array of assets type, but currently only `["measuringstation"]` actually works.
- Optional

bbox
----
- The bounding box for the map.
- a 4-number array [westmost, southmost, eastmost, northmost] with WGS84 coordinates.
- No, defaults to Parramatta, Sydney if not set: [150.9476776123047, -33.87831497192377, 151.0842590332031, -33.76800155639643]

datetime
--------
- Objects for relative time. Used to decide which timestep of a raster to show. Example:
  ::

    {
      "type": "relative",
      "to": "now",  // or "start" or "end" (of the raster timeseries)
      "offset": 0, // Number of seconds before or after the "to" point
      "modulo": 300 // Optional number of seconds, only works for to: "now";
      // Current time is rounded down to a multiple of this many seconds.
      // Use so that the time only changes e.g. every five minutes.
    }

- Object
- No, optional for temporal rasters. Default is to use the server default (closest to now?)

points
------
- Points for point markers. Example:
  ::

    {
      "title": "This is a point",
      "geometry": {
        "type": "Point",
        "coordinates": […] // GeoJSON
      }
    }

- Array of objects.
- Optional


rasters
-------
- Raster objects to show as WMS layers. Example:
  ::

    {
      "uuid": string,  // UUID of the raster as in the API
      "opacity": "0.5" // string with the opacity as a number
    }

- Array of raster objects.
- Optional

wmsLayers
---------
- Array of extra wms layers. Example:
  ::

    {
      "layers": "gauges",
      "format": "image/png",
      "url": "https://geoserver9.lizard.net/geoserver/parramatta/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1",
      "height": 256,
      "zindex": 1004,
      "width": 256,
      "srs": "EPSG:3857",
      "transparent": true
    }

- Array.
- Optional


Tile type: timeseries
=====================

The timeseries type tiles are charts of timeseries, they can have two
sources: intersections of a point geometry with a raster or timeseries
objects from the API.

The number of things to chart is not limited, but there can be at most
two different observation types; one will be on the left Y-axis and one
will be on the right Y-axis.

Observation types with scale 'ratio' will be shown as bar charts, types with
scale 'interval' will be line charts.

The time period shown is defined by the 'periodHoursRelativeToNow' property,
if it is not set then the default for the whole dashboard set in the Meta
properties is used. If neither is set then the default is [-24, 12], one day
before now and half a day after.

timeseries
----------
- Timeseries UUIDs.
- Array of timeseries UUIDs.
- Mandatory


colors
------
- Color codes for each timeseries.
- Array of color codes for each timeseries, must be equal in length to the timeseries
  array plus the length of the rasterIntersections array.
- Optional. If not set, the colors cycle through three shades of blue.


rasterIntersections
-------------------
- Intersections with the keys *uuid* and *geometry*.
  ::

    {
      "uuid": UUID of the raster,
      "geometry": {
        "type": "Point",
        "coordinates": [
          5.9223175048828125,
          52.15118665954508
        ]
      }
    }

- Array of objects with the keys shown above.
- Optional


Tile type: external
===================

The external type tile is for external web pages (must be https, and
may have headers that prevent us from using iframes, so not all pages
work!).

imageUrl
--------
- Url of image to show in the tile.
- String.
- Optional, an icon is shown as default.

url
---
- Web page to show in an iframe in the fullscreen version.
- String.
- Optional, nothing is shown as default.


Tile type: statistics
=====================

Nothing can be configured in a statistics type tile, so there should be exactly 1 of this tile type in the list.

The app just retrieves all the alarms that the user has access to, assumes they’re all relevant, and shows statistics on them.


Meta properties
===============

periodHoursRelativeToNow
------------------------
- It sets the hours from now, with the amount of hours you can look into the past and the amount of hours you can see into the future.
- 2-element array of integers.
- No. If not set, the default is [-24, 12].
-

referenceLevels
---------------

title
-----

headerColors
------------

logo
----

gridView
--------

mapBackgrounds
--------------
