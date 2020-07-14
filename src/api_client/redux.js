/*

   Helper functions for Redux.

   When to use: when you have simple objects that you can fetch by
   some ID and want to store by some ID.

   Exposes some functions:

   - makeReducer() -- to make a reducer for the Redux state that will
     contain the data and metadata

   - makeGetter() -- to make a function that can be used to get the
     data from the state (and knows about stale data and such)

   - makeFetcher() -- wraps some function that fetches an object
     asynchronously so that the right actions are dispatched around it

   - makeDeleter() -- similarly, a function that will delete the data
     items, if needed.

   - getOrFetch() -- the thing that ties it all together.

   Usage:

   In your reducers:

       const rootReducer = combineReducers({
           rasters: makeReducer('rasters'),
           ...
       });

   In your actions:

      const fetchRaster = makeFetcher('rasters', getRasterDetail);

   In your component's mapStateToProps:

      getRaster: makeGetter(state.rasters),

   In your component's mapDispatchToProps:

      fetchRaster: (id) => fetchRaster(dispatch, id),

   Now use the whole thing as

      getOrFetch(this.getRaster, this.fetchRaster, id);

   Actions are only for internal use, but they all have structure
   like:

   { type: 'OBJECTNAME', action: 'receive', id: 'someid', object:
     theobject, }

   So no separate 'ADD_OBJECTNAME' etc as that isn't necessary for
   anything.

   Internal state has the form:

   { data: {}, metadata: {} }

   Data is an object that contains the actual data items. Metadata
   contains extra information like isFetching, receivedTimestamp and
   error.

   React components that don't care about the metadata should probably
   depend on state.objectname.data in connect(), so that they only
   update when the contents of that change. Access to the data will be
   by getOrFetchObjectName().  */

const INITIAL_METADATA = {
  isFetching: false,
  error: null,
  fetchTimestamp: null,
  receivedTimestamp: null
};

export function makeReducer(objectName) {
  const upperObjectName = objectName.toUpperCase();

  const reducer = (state = {data: {}, metadata: {}}, action) => {
    if (!action || action.type !== upperObjectName) {
      return state;
    }

    const data = Object.assign({}, state.data);
    const metadata = Object.assign({}, state.metadata);

    switch (action.action) {
      case 'fetch':
        metadata[action.id] = Object.assign({}, INITIAL_METADATA);
        metadata[action.id].isFetching = true;
        metadata[action.id].fetchTimestamp = new Date().getTime();
        return {data: state.data, metadata: metadata};
      case 'receive':
        if (state.metadata[action.id]) {
          metadata[action.id] = Object.assign({}, INITIAL_METADATA);
          metadata[action.id].receivedTimestamp = new Date().getTime();
          data[action.id] = action.object;
          return {data: data, metadata: metadata};
        } else {
          // This fetch is apparently stale, item got deleted
          return state;
        }
      case 'error':
        if (state.metadata[action.id]) {
          metadata[action.id] = Object.assign({}, INITIAL_METADATA);
          metadata[action.id].receivedTimestamp = new Date().getTime();
          metadata[action.id].error = action.error;
          return {data: state.data, metadata: metadata};
        } else {
          // This fetch is apparently stale, item got deleted
          return state;
        }
      case 'delete':
        delete data[action.id];
        delete metadata[action.id];
        return {data: data, metadata: metadata};
      default:
        return state;
    }
  };

  return reducer;
}

export function makeGetter(objectState, params = {}) {
  const FETCH_TIMEOUT_MS = (params.fetchTimeout || 0) * 1000;
  const STORE_TIMEOUT_MS = (params.storeTimeout || 0) * 1000;
  const RETRY_ERROR = params.retryError || true;

  return function getter(id) {
    const { data, metadata } = objectState;

    let returnValue = null;
    let shouldFetch = false;

    // See if we have it
    if (data[id]) {
      // Yes, return it
      returnValue = data[id];

      // But is it old? Then still get it
      if (STORE_TIMEOUT_MS && metadata[id].receivedTimestamp) {
        const timeStored = (new Date().getTime()) - metadata[id].receivedTimestamp;

        if (timeStored > metadata[id].receivedTimestamp) {
          shouldFetch = true;
        }
      }
    } else {
      // We don't have it.
      if (!metadata[id] || !metadata[id].isFetching) {
        // We're not yet fetching it. Get it unless there was an error we don't retry.
        if (RETRY_ERROR && metadata[id] && metadata[id].error) {
          shouldFetch = false;
        } else {
          shouldFetch = true;
        }
      } else {
        // We *are* fetching it. Does that stop us?
        if (FETCH_TIMEOUT_MS && metadata[id].fetchTimestamp) {
          // Depends on how long ago it was.
          const timeFetching = (new Date().getTime()) - metadata[id].fetchTimestamp;

          shouldFetch = timeFetching > FETCH_TIMEOUT_MS;
        } else {
          // Yes.
          shouldFetch = false;
        }
      }
    }

    return {
      object: returnValue,
      shouldFetch: shouldFetch
    };
  };
}

export function makeFetcher(objectName, fetchFunction) {
  const upperObjectName = objectName.toUpperCase();

  return function fetcher(dispatch, id) {
    dispatch({
      type: upperObjectName,
      action: 'fetch',
      id
    });

    fetchFunction(id).then(
      (object) => dispatch({
        type: upperObjectName,
        action: 'receive',
        id,
        object
      }),
      (error) => dispatch({
        type: upperObjectName,
        action: 'error',
        id,
        error
      }));
  };
}

export function makeDeleter(objectName) {
  return function deleter(dispatch, id) {
    dispatch({
      type: objectName.toUpperCase(),
      action: 'delete',
      id
    });
  };
}

export function getOrFetch(getter, fetcher, id) {
  // Helper function that combines the parts.
  const { object, shouldFetch } = getter(id);

  if (shouldFetch) {
    fetcher(id);
  }

  return object;
}
