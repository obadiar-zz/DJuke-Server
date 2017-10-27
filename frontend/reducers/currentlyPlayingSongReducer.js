import * as types from '../actions/types';

const currentlyPlayingSongReducer = (state = "", action) => {
	console.log("HERES", action, state);
	switch (action.type) {
		case types.NEW_SONG_PLAYING:
			if (state === "" || state.id !== action.song.id) return action.song;
			return state;
		default:
			return state;
	}
};

export default currentlyPlayingSongReducer;
