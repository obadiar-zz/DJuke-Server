const express = require('express');
const router = express.Router();
const axios = require('axios');
var ip = require("ip");
const passport = require('passport');
var localStorage = require('localStorage');
// YOUR API ROUTES HERE
router.get('/auth/spotify', passport.authenticate('spotify', { scope: ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'streaming', 'ugc-image-upload', 'user-follow-modify', 'user-follow-read', 'user-library-read', 'user-library-modify', 'user-read-private', 'user-read-birthdate', 'user-read-email', 'user-top-read', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'] }),
  function (req, res) {
    // console.log("REQ user", req.user);
    res.redirect('/');
  })

router.get('/auth/spotify/callback', function (req, res) {
  // console.log("req nervous", req.query.code);
  // console.log("storage", localStorage.getItem('accessToken'));
  res.redirect('/');
})
module.exports = router;
