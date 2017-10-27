const express = require('express')
const bodyParser = require('body-parser')
var spotify = require('../utils/SpotifyUtils.js')
const router = express.Router();
var ip = require('ip');
var axios = require('axios');

var initializeSpotiyUser = spotify.SpotifyUserInitialization;
var confirmExpectedPlaylistPlaying = spotify.confirmExpectedPlaylistPlaying;


// Here we add the ip address of the host to the master server
// for easy ip discover on a local network. We also initialize
// the spotify user.
router.get("/registerHostSpotify", function (req, res) {
  console.log("Receieved request.");

  axios.post("https://rocky-brook-68243.herokuapp.com/register", {
    lan: ip.address()
  })

  var token = "Bearer " + req.query.token;
  initializeSpotiyUser(token, res);
})

// This confirmation stage is necessary to make sure the user
// is playing music on the right playlist.
router.get("/continueHostSpotify", function (req, res) {
  console.log("Receieved request.");
  var token = "Bearer " + req.query.token;
  console.log("REQ QUERYTOKEN", req.query.token);
  var user_id = req.query.user;
  console.log("USERID", user_id);
  var playlist_id = req.query.playlist;
  var playlist_uri = "spotify:user:" + user_id + ":playlist:" + playlist_id;
  confirmExpectedPlaylistPlaying(token, user_id, playlist_id, playlist_uri, res);
})



module.exports = {
  router
};
