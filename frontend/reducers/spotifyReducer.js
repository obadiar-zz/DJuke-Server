import * as types from '../actions/types';
const initialState = {
  user: '',
  playlist: '',
  token: "BQDQrytplt7Xm1k3EPCnIjAxM9X5kw41AipNPZx3hvfzVMPLN034XeXMv2hSUcCCju6s8Oe1rJZjeiiEMbxYSRg521Fgof39rUswlojstANziT3LKv6FliyNDbowAZex5myVsfDcVbr2-SBIO8mxrPWgAVNC5HZHApZcl4YJUMcRlAQsrhfMUlMeK49aGqOl3QV4zBxFeE_CG2JY96yqexa309nPPHTB-J1C7TSudwQZaDYBDRmmzykF7Wve3xV0UYOkfkEVjEgZfQ2IYL3LDulnQc_vIDbsNi0-9y8j64B1bEhd8n3iKi8PuQpXkvLYkkZLgfFaYFnZ3cbJfs3XhZ-7wQ",
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
