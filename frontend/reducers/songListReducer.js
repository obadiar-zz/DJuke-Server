import * as types from '../actions/types';

const initialState = {list:
  [
  ]
};

const copyState = (state) => {
  let newState = {list: []}
  state.list.forEach(song => {
    let newUpvotes = Object.assign({}, song.upvotes)
    let newSong = Object.assign({}, song, {upvotes: newUpvotes})
    newState.list.push(newSong)
  })
  return newState
}

const songListReducer = (state = initialState, action) => {
  let newState = copyState(state);
  switch (action.type) {
    case types.UPDATE_QUEUE:
      newState = action.data;
      newState.list.reverse()
      return newState;
    default:
      return state;
  }
};

export default songListReducer;
