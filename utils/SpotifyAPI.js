// Library of calls interacting with the Spotify API.
// Each of these calls returns a promise.

var axios = require('axios');

function pauseSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/pause',
    method: "put",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function playSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/play',
    method: "put",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function nextSong(client_token) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player/next',
    method: "post",
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserInfo(client_token) {
  return axios({
      url: 'https://api.spotify.com/v1/me',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserPlaylists(client_token, response) {
  var user_id = response.data.id;
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getSongInfo(client_token, song_id) {
  return axios({
    url: "https://api.spotify.com/v1/tracks/" + song_id,
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function getUserTracks(client_token, user_id, playlist_id) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true
  })
}

function deleteTracks(client_token, user_id, playlist_id, tracksToDelete) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    method: 'delete',
    headers: {
      Authorization: client_token
    },
    json: true,
    data: {
      tracks: tracksToDelete.map((x, i) => ({
        "position": i,
        "uri": x
      }))
    }
  })
}

function addTrack(client_token, user_id, playlist_id, songURI) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + songURI,
    method: 'post',
    headers: {
      Authorization: client_token
    },
    json: true,
  })
}

function getPlayerInfo(client_token,) {
  return axios({
    url: 'https://api.spotify.com/v1/me/player',
    method: 'get',
    headers: {
      Authorization: client_token
    },
    json: true,
  })
}

function createPlaylist(client_token, user_id, playlist_description, playlist_name) {
  return axios({
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    method: 'post',
    headers: {
      Authorization: client_token
    },
    json: true,
    data: {
      "description": playlist_description,
      "public": true,
      "name": playlist_name
    }
  })
}

module.exports = {
  pauseSong,
  playSong,
  nextSong,
  getUserInfo,
  getSongInfo,
  getUserPlaylists,
  getUserTracks,
  deleteTracks,
  addTrack,
  getPlayerInfo,
  createPlaylist
}
