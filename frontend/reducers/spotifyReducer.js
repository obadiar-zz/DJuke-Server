import * as types from '../actions/types';
const initialState = {
  user: '',
  playlist: '',
  token: "",
  confirm_status: false,
};

const copyState = (state) => {
  return Object.assign({}, state)
}
console.log("initial state", initialState);
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
    case types.SPOTIFY_TOKEN:
      newState.token = action.token;
      return newState;
    default:
      return state;
  }
};

export default spotifyReducer;
