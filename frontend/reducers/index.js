import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import spotifyReducer from './spotifyReducer';
import songListReducer from './songListReducer';
import currentlyPlayingSongReducer from './currentlyPlayingSongReducer';

const rootReducer = combineReducers({
  spotify: spotifyReducer,
  songList: songListReducer,
  currentlyPlayingSong: currentlyPlayingSongReducer,
  routing,
});

export default rootReducer;
