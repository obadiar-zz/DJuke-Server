import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQA-vUftoPVoEkUSeXJx9mMuXHGnVfODc15E8L15T8xbLjJ_WcOgsrBrzl1KKQsAoPUAJVMmVlG1PIT8c32B_V5Q_ZlRVcikxs6B5uoOAbtNPBNpkJfUUU9t1GauaE4P91zpbGYtHPucWfTD4c2oQxsBksiJocnjT2EFTRp6gUXufT3maa_aNUpbzyJ75W9Ih4P7QvAySdp7p9Q7-TBdV21Fvp76z1uy7vigBrUzCH7jYwrgyZG8HOCk2QjPUCqS6bDtqeKlzDDKsy34V4JrSW-YX4_ea8m51WOyQ04gIk4I17pB45eJCRt0Zx2RzFhj1zeO270",
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
