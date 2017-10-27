import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQBA6uP8UXuGWgS5lNEIPA3DOr4jr0_Z0sfoNkzeLE9T6NBf-adcgqxDxmCRT2MX4Ua8tAExTKaOvZ-Q3ggqvgqLk7uhGL_OM27Tt-825xZxeNNZFkNbCuxAqKYlws3Ke25MQ0c17dRKDpkllHJFX_Oxqh8NSv7HeHXo-a1E1HE8yXafwbeju6m1DjGY9HXVNLjRK3NqE_XXXaxGCQy9DdSDB3wjSNMqQ9NSmeh-2EpmaK3Q5H0HFpGOm43GY5PAjPHWvXbCEkOt3FON38JhqCnlrbayfdhUfVK6dDgGki09YnxahK86rHY0l30X8A0A8lIZ",
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
