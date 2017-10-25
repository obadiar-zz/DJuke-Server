import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
<<<<<<< HEAD
  token: process.env.SPOTIFY_TOKEN,
=======
  token: 'BQDSt2hftHVqQGAdLuOUq8fPUbGSakXF3bSeVQMWvNnprbJdjbO6Sb_C78yBRG-5WUNwCkEnjOEgpf1YS56vnEEJKk3ahmcRCEr_0VFWGoOyLsGhlU0o3P0Y_bTer5UYy7g1sQosGN3KEYuIo8yRr5nux-LX67y0CMsbW_y834rCOc7yPlOSCZv7xntQGUrWIhMFYv-NJkoqnzcqxcpvK3kITlfqb6zjxclea3QJ7xDCofZwFiUDBFdJTw76VjJkq_F-CiUHjj3_wuqhFHPuOgfXcMUTNYempshYpyOYKtvZLWM9s42RgL-yhTwBS54QraxEO90',
>>>>>>> rob_dangerous
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
