import { combineReducers } from "redux";
import {
  ADD_ASSET,
  ADD_LEGEND,
  ADD_TIMESERIES,
  FETCH_TIMESERIES_EVENTS,
  RECEIVE_TIMESERIES_EVENTS,
  FETCH_RASTER_EVENTS,
  RECEIVE_RASTER_EVENTS,
  SET_DATE,
  SET_TIME,
  SET_NOW,
  RESET_DATETIME,
  SET_MAP_BACKGROUND,
  RECEIVE_ALARMS,
  FETCH_BOOTSTRAP,
  FETCH_LEGEND,
  RECEIVE_BOOTSTRAP_ERROR,
  RECEIVE_BOOTSTRAP_SUCCESS
} from "./actions";

import { BoundingBox } from "./util/bounds";

import { makeReducer } from "lizard-api-client";

function assets(
  state = {
    measuringstation: {}
  },
  action
) {
  switch (action.type) {
    case ADD_ASSET:
      const newAssets = { ...state };
      const newAssetsOfType = { ...newAssets[action.assetType] };
      newAssetsOfType[action.id] = action.instance;
      newAssets[action.assetType] = newAssetsOfType;
      return newAssets;
    default:
      return state;
  }
}

function legends(state = {}, action) {
  let newState;
  let newLegend;
  switch (action.type) {
    case FETCH_LEGEND:
      newState = { ...state };

      if (action.uuid in newState) {
        newLegend = { ...newState[action.uuid] };
        newLegend.isFetching = true;
      } else {
        newLegend = {
          isFetching: false,
          data: null,
          error: null
        };
      }
      newState[action.uuid] = newLegend;
      return newState;
    case ADD_LEGEND:
      newState = { ...state };
      newLegend = { ...newState[action.uuid] };
      newLegend.isFetching = false;
      if (action.data === null) {
        newLegend.data = null;
        newLegend.error = "Error while fetching raster!";
      } else {
        newLegend.data = action.data;
        newLegend.error = null;
      }
      newState[action.uuid] = newLegend;
      return newState;
    default:
      return state;
  }
}

function session(
  state = {
    isFetching: false,
    hasBootstrap: false,
    bootstrap: null
  },
  action
) {
  switch (action.type) {
    case FETCH_BOOTSTRAP:
      return {
        isFetching: true,
        hasBootstrap: state.hasBootstrap,
        bootstrap: state.bootstrap,
        error: null
      };
    case RECEIVE_BOOTSTRAP_SUCCESS:
      return {
        isFetching: false,
        hasBootstrap: true,
        bootstrap: action.bootstrap,
        error: null
      };
    case RECEIVE_BOOTSTRAP_ERROR:
      return {
        isFetching: false,
        hasBootstrap: false,
        bootstrap: null,
        error: action.error
      };
    default:
      return state;
  }
}

function timeseries(state = {}, action) {
  switch (action.type) {
    case ADD_TIMESERIES:
      const newState = { ...state };
      newState[action.uuid] = action.timeseries;
      return newState;
    default:
      return state;
  }
}

function timeseriesEvents(state = {}, action) {
  let newState;
  switch (action.type) {
    case FETCH_TIMESERIES_EVENTS:
      newState = { ...state };
      newState[action.uuid] = {
        isFetching: true,
        start: action.start,
        end: action.end,
        events: null
      };
      return newState;
    case RECEIVE_TIMESERIES_EVENTS:
      newState = { ...state };
      newState[action.uuid] = {
        isFetching: false,
        start: action.start,
        end: action.end,
        events: action.events
      };
      return newState;
    default:
      return state;
  }
}

function rasterEvents(state = {}, action) {
  let newState;
  let eventsForRaster = {};

  switch (action.type) {
    case FETCH_RASTER_EVENTS:
      newState = { ...state };
      if (newState[action.uuid]) {
        eventsForRaster = { ...newState[action.uuid] };
      }
      eventsForRaster[action.geomKey] = {
        isFetching: true,
        start: action.start,
        end: action.end,
        events: null
      };
      newState[action.uuid] = eventsForRaster;
      return newState;
    case RECEIVE_RASTER_EVENTS:
      newState = { ...state };
      if (newState[action.uuid]) {
        eventsForRaster = { ...newState[action.uuid] };
      }
      eventsForRaster[action.geomKey] = {
        isFetching: false,
        start: action.start,
        end: action.end,
        events: action.events
      };
      newState[action.uuid] = eventsForRaster;
      return newState;
    default:
      return state;
  }
}

function settings(
  state = {
    configuredDate: null,
    configuredTime: null,
    nowDateTime: new Date().toISOString(),
    configuredTitle: null,
    configuredLogoPath: null,
    mapBackground: null,
    configuredMapBackgrounds: null
  },
  action
) {
  switch (action.type) {
    case SET_NOW:
      return { ...state, nowDateTime: action.nowDateTime };
    case SET_DATE:
      return { ...state, configuredDate: action.date };
    case SET_TIME:
      return { ...state, configuredTime: action.time };
    case RESET_DATETIME:
      return { ...state, configuredDate: null, configuredTime: null };
    case SET_MAP_BACKGROUND:
      return { ...state, mapBackground: action.mapBackground };
    default:
      return state;
  }
}

function alarms(
  state = {
    data: [],
    rasterData: [],
    timeseriesData: []
  },
  action
) {
  switch (action.type) {
    case RECEIVE_ALARMS:
      // We received either raster or timeseries alarms; combine them both into one
      // 'data' array.
      const newState = { ...state };
      if (action.isTimeseries) {
        newState.timeseriesData = action.alarms;
      } else {
        newState.rasterData = action.alarms;
      }

      newState.data = newState.timeseriesData.concat(newState.rasterData);
      return newState;

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  alarms,
  assets,
  legends,
  rasters: makeReducer("rasters"),
  session,
  timeseries,
  timeseriesEvents,
  rasterEvents,
  settings
});

export default rootReducer;

// Selectors
// See https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170

export const getBootstrap = function(state) {
  if (!state.session || !state.session.hasBootstrap) return null;
  return state.session.bootstrap;
};

const getConfiguration = function(state) {
  const bootstrap = getBootstrap(state);
  if (bootstrap && bootstrap.configuration) {
    return bootstrap.configuration;
  } else {
    return null;
  }
};

export const getAllTiles = function(state) {
  const configuration = getConfiguration(state);
  if (configuration && configuration.tiles) {
    return configuration.tiles;
  } else {
    return [];
  }
};

export const getReferenceLevels = function(state) {
  const configuration = getConfiguration(state);
  if (configuration && configuration.referenceLevels) {
    return configuration.referenceLevels;
  } else {
    return {};
  }
};

export const getTileById = function(state, id) {
  return getAllTiles(state).filter(tile => {
    if (Number(tile.id) === Number(id)) return tile;
    return false;
  });
};

export const getConfiguredDate = function(state) {
  return state.settings.configuredDate || "";
};

export const getConfiguredTime = function(state) {
  return state.settings.configuredTime || "";
};

export const getNow = function(state, tile) {
  // Return a *string* containing the current UTC date/time.
  // This is not the "real" current time, but either a time configured
  // by the user, or the time updated by the main App component or even
  // in the Tile.
  // Use a string instead of a datetime so React can see that it hasn't
  // changed.

  if (tile && tile.nowDateTime) {
    return tile.nowDateTime;
  } else if (state.settings.configuredDate && state.settings.configuredTime) {
    return (
      state.settings.configuredDate + "T" + state.settings.configuredTime + "Z"
    );
  } else {
    return state.settings.nowDateTime;
  }
};

export const getCurrentPeriod = function(state, tile) {
  // Return start and end of the current period in charts, as UTC timestamps.
  // Defined as a period around 'now', in hours.
  // Now is an ISO string containing the UTC datetime.
  const now_dt = new Date(getNow(state, tile));
  const bootstrap = getBootstrap(state);
  let offsets;

  if (tile.periodHoursRelativeToNow) {
    offsets = tile.periodHoursRelativeToNow;
  } else if (
    bootstrap &&
    bootstrap.configuration &&
    bootstrap.configuration.meta &&
    bootstrap.configuration.meta.periodHoursRelativeToNow
  ) {
    offsets = bootstrap.configuration.meta.periodHoursRelativeToNow;
  } else {
    offsets = [-24, 12];
  }

  const period = {
    start: now_dt.getTime() + offsets[0] * 3600 * 1000,
    end: now_dt.getTime() + offsets[1] * 3600 * 1000
  };

  return period;
};

export const getCurrentMapBackground = state => {
  return state.settings.mapBackground;
};

export const getConfiguredTitle = state => {
  const configuration = getConfiguration(state);
  return configuration && configuration.meta && configuration.meta.title
    ? // Read from client-config iff specified:
      configuration.meta.title
    : // Else, use portal name (only works in production env):
      window.location.href.split("/")[2].split(".")[0];
};

export const getConfiguredLogoPath = state => {
  const configuration = getConfiguration(state);
  return configuration && configuration.meta && configuration.meta.logo
    ? configuration.meta.logo
    : null;
};

export const getConfiguredMapBackgrounds = state => {
  const configuration = getConfiguration(state);
  if (
    configuration &&
    configuration.meta &&
    configuration.meta.mapBackgrounds
  ) {
    return configuration.meta.mapBackgrounds;
  } else {
    return null;
  }
};

export const getConfiguredPortalBBox = function(state) {
  if (!state.session || !state.session.hasBootstrap) return null;
  const bounds = state.session.bootstrap.state.spatial.bounds;
  const bbox = [
    bounds._southWest.lng, // westmost
    bounds._southWest.lat, // southmost
    bounds._northEast.lng, // eastmost
    bounds._northEast.lat // northmost
  ];
  return new BoundingBox(bbox[0], bbox[1], bbox[2], bbox[3]);
};

export const getConfiguredColumnCount = function(state) {
  const configuration = getConfiguration(state);
  if (
    configuration &&
    configuration.meta &&
    configuration.meta.gridView &&
    configuration.meta.gridView.columnCount
  ) {
    return configuration.meta.gridView.columnCount;
  } else {
    return null;
  }
};

export const getConfiguredTileHeaderColors = function(state) {
  const configuration = getConfiguration(state);
  if (configuration && configuration.meta && configuration.meta.headerColors) {
    return configuration.meta.headerColors;
  } else {
    return { bg: "#FFFFFF", fg: "#777777" };
  }
};
