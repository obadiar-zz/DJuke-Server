import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQDNaeMluTsAgR-kTy0BFNbYAcGrBvkyfGOF0O1LtYiHywmm9NLJkhrSRWeJKnI9YfURQUO8yQIc8iYzTNZ_jWCsm3wJQJD7f_tFecznKtWCtc61jdoIaxtd8PSz6-i9iUyKrYcRWo2fEWV8kgCih8RsMMSIUA9uUFXvsCTzMSN0s-9GzCqFzeez1EHIafj9ftYTGXBlLA9xW9_7lHIpykfxMO54sb24eIqpLmgvE9IexespmN5zT6ch83cs01oyDyZINMiVIJsnWUqvoQ58hfdFuQeTrAy511cA3e3_9KPzuggAJGZXtZOX7KTfR6_laMiJccc",
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
