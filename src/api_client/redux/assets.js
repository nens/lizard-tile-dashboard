// Redux stuff for assets. Only works for measuringstations right now.

export const ADD_ASSET = 'ADD_ASSET';

// Asset
export const addAssetAction = (assetType, id, instance) => {
  return {
    type: ADD_ASSET,
    assetType: assetType,
    id: id,
    instance: instance
  };
};

export function assetsReducer(
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
