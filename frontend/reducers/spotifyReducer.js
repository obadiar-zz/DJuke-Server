import * as types from '../actions/types';

const initialState = {
  user: '',
  playlist: '',
  token: "BQA2mKXLLV8-UlVQK4uBSyswPHBtVsFwLKknhgAXfa_1gBSJcH6JQ0-faBSTfmhqvIOEv6HyMqGkHUv0uFG_LOmVunL04iTRnga4C0Sne3Fp-MGE80p43Fk-_1tA2w2YyuEPxL9mpoOSLlRd0OSoHJ5gSj556LYJq9MhPxR7OiLpu_6yR156Dwtu31MATaluaF3aG2UVevt7vgWdIy8PLeefdCT5XQB83CGha3wClMkOvC_56s6uUweCvDjxbCMpsHbF9GuCL9kBCmJpqcwCGtFJZsNEsswg3CSZe0OCYhpkLWcI9rbpfweXQNuWRtrrwleCw4c",
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
