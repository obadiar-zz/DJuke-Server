import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQB5eZBmDwHoh331MsqlKtmMYJgQcV0OFUML3ofVYzzROAyYt0FcsK5md1PHvYlykQKNjR1eLTOxrNafVbHDWTCHw6JXzeop2vbhAcGUSbjBK8tOdP4-uStZAr5L8shQUdMF0RZ3Yi9MWS40ZCM2c7746wt0iCC0mMjmSFiSkBW94L8Espk_rGsPPJGThrzH9QzqRc5XoshMKAXY8vzlAs1qoBUjs6LDjKR6TdimhTCyXYvkjGnE0M6JuBa171MlpbtPf59jZY8nWOTF3WlWKqNne1v9tWcNEMLZ4X5HuJWz-ywlNUmJAVHb6bC2iiJZBTiO-HE",
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
