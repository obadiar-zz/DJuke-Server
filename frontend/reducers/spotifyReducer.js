import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQBNbPtZj2qNSKp_3z4Ir5UfWktp3O8R3VVERuZz2Dmk-YC7WjxGidr9It9soFVtMoQ1Y39ViQTQtiu7GxLXzMD1KoLGCxAWcOSR6JuQns5Q9iJrDpXmRRRsncOI1R4YJ5_34_NeTsA829PXIixiJ3277tEDJnsgZoRVwd7km4XRWdKIACjeL80HOf32qDPLg2mYDnjYvJyF3PAttY-cTpVxClS-wn3-WbWo-0y9s9GQy4C9ohbolkDXOj9BzUjAiPNRp0lnDmEsKtt56Xi98_-r_4blF0iE9A-SKE2kXwvqBjmaPA91ZtG4YiSMu2-NYshjuHM",
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
    default:
      return state;
  }
};

export default spotifyReducer;
