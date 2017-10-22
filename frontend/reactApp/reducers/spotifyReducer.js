import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: 'BQDsWQvW_Ber46jxRjvg5kXXMnSi_jNN3Xeijmz7TipZ4uSdiNHDOBpH3_-i-zTDZlrvcqK6ghTDMudy_Ixa-maT_kjFy8qK75KevbgJhiBXYzWUaCWE8qoQvJ8RwCdpHUpoc2NKjSPyIbxoHx3KcJ5eU_mci-Y7tff6Ovqa-IhsRSd6Jk-z6LPKhzYKGVI-96e7MM0WCVwxqNsbLBuUYi9BM0MGeAxCJnK5qBuMXNh4BQuxP8OVXBJDm2VpQ65sZ_ZtF077Bcnigl1OnLacpmJNSqQmIgGgoxCJ6WVpYFrw_kwrmtlzFcf_JjD-3Ejt5N4qV-g',
  confirm_status: false,
};

const copyState = (state) => {
  return Object.assign({}, state)
}

const spotifyReducer = (state = initialState, action) => {
  let newState = copyState(state);
  switch (action.type) {
    case types.SPOTIFY_MOUNT:
      newState.user = action.user;
      newState.playlist = action.playlist;
      return newState;
    case types.SPOTIFY_CONFIRM:
      newState.confirm_status = action.confirm_status;
      return newState;
    default:
      return state;
  }
};

export default spotifyReducer;
