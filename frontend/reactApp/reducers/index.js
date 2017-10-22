import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import spotifyReducer from './spotifyReducer';
import songListReducer from './songListReducer';

const rootReducer = combineReducers({
  spotify: spotifyReducer,
  songList: songListReducer,
  routing,
});

export default rootReducer;
