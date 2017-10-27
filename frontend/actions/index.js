import * as types from './types';

export function spotifyMount(user, playlist) {
  return {
    type: types.SPOTIFY_MOUNT,
    user,
    playlist,
  };
}

export function spotifyConfirm(confirm_status) {
  return {
    type: types.SPOTIFY_CONFIRM,
    confirm_status,
  };
}

export function updateQueue(data) {
  return {
    type: types.UPDATE_QUEUE,
    data,
  };
}

export function newSongPlaying(song) {
  return {
    type: types.NEW_SONG_PLAYING,
    song,
  };
}
