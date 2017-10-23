import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: 'BQB5jpoU4KTkjIqBeVb-QiOrMiUPQohsjGY8_cRrFBV1hdgXAphF07QCa6mChcVVxIJXCuQ5tWzwazYBtSYJYqzAtSs4Qazi-vMzttBCEC_Alhwk0qvUgDuPYFI3BHm9QXmHYZ6UKQQ04TV1F0n-IKejGAZYQQEYhcqVt9Z0NdoKeNwQk_bAKXivAlvFurKZZpdJ6UJhEXxvSYZ0gAZZ_zHdbwV5Pir6Zmapsz20peGqpStMf6Wv2sdFDyzj3y57J2vCqXvbcpnYdxbHE-GXnxKPliKLZE4K1HtRFWxXrtVLHsT-FO7fEheZMdvC4qfB1gX71AE',
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
