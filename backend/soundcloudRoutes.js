const express = require('express')
const bodyParser = require('body-parser')
var spotify = require('../utils/SpotifyUtils.js')
const router = express.Router();
var ip = require('ip');
var axios = require('axios');

var localStorage = require('localStorage');

router.get('/callback', function (req, res, next) {
	res.sendFile(__dirname + '/../public/callback.html')
})

module.exports = {
	router
};
