var request = require('request'); // "Request" library

var client_id = process.env.client_id; // Your client id
var client_secret = process.env.client_secret; // Your secret

var default_song_uri = "spotify:track:6rPO02ozF3bM7NnOV4h6s2";

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

function pauseSong(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.put(options, function (error, response, body) {
    console.log(body);
  });
}

function playSong(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.put(options, function (error, response, body) {
    console.log("Song playing");
    //res.send("Success, song playing!");
  });
}

function nextSong(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/next',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });
}

function prevSong(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });
}

function seekSong(client_token, seconds_position) {
  seconds_position = seconds_position * 1000
  var options = {
    url: 'https://api.spotify.com/v1/me/player/seek?position_ms=' + seconds_position,
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.put(options, function (error, response, body) {
    console.log(body);
  });
}

function getPlayerInfo(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    console.log(body);
  });
}

function getClientInfo(client_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    console.log(body);
  });
}

function getClientPlaylists(client_token) {
  var options = {
    url: '	https://api.spotify.com/v1/users/' + clientID + '/playlists',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    console.log(body);
    var data = body.items.reduce((flag, x) => x.name === "djukeio" ? true : flag, false);
    console.log(data);
  });
}

function createPlaylist(client_token) {
  var options = {
    url: '	https://api.spotify.com/v1/users/' + clientID + '/playlists',
    headers: {
      Authorization: client_token
    },
    json: true,
    body: {
      "description": "DJuke.io, how jukebox's should be.",
      "public": true,
      "name": "djukeio"
    }
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });
}

function addTrackToPlaylist(userID, playlistID, client_token, songURI) {
  var user_id = userID;
  var playlist_id = playlistID
  var playlist_uri = "spotify:user:"+userID+":playlist:"+playlistID;
  console.log("FOUND!", user_id);
  var options = {
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
    headers: {
      Authorization: client_token
    }
  };
  request.get(options, function (error, response, body) {
    var toDelete = JSON.parse(body).items.map((x, i) => x.track.uri);
    var options = {
      url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
      headers: {
        Authorization: client_token
      },
      json: true,
      body: {
        tracks: toDelete.map((x, i) => ({
          "position": i,
          "uri": x
        }))
      }
    };
    request.delete(options, function (error, response, body) {

  var options = {
    url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks?uris=' + songURI,
    headers: {
      Authorization: client_token
    }
  };
  request.post(options, function (error, response, body) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: {
        Authorization: client_token
      },
      json: true
    };
    request.post(options, function (error, response, body) {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          Authorization: client_token
        },
        json: true
      };
      request.put(options, function (error, response, body) {
        console.log("Song playing");
        //res.send("Success, song playing!");
      });
    });
  });
  });
    });
}



function addTrackToPlaylistFIRST(userID, playlistID, client_token, songURI) {
  var user_id = userID;
  var playlist_id = playlistID
  var playlist_uri = "spotify:user:"+userID+":playlist:"+playlistID;
  var options = {
    url: 'https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks?uris=' + songURI,
    headers: {
      Authorization: client_token
    }
  };
  request.post(options, function (error, response, body) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: {
        Authorization: client_token
      },
      json: true
    };
    request.post(options, function (error, response, body) {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          Authorization: client_token
        },
        json: true
      };
      request.put(options, function (error, response, body) {
        console.log("Song playing");
        //res.send("Success, song playing!");
      });
    });
      });
}

function SpotifyUserInitialization(client_token, res) {
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    var user_id = body.id;
    var options = {
      url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
      headers: {
        Authorization: client_token
      },
      json: true
    };
    request.get(options, function (error, response, body) {
      var data = body.items.filter(x => x.name === "djukeio");
      if (data.length === 1) {
        var playlist_id = data[0].id;
        var playlist_uri = data[0].uri;
        console.log("FOUND!");
        var options = {
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
          headers: {
            Authorization: client_token
          }
        };
        request.get(options, function (error, response, body) {
          var toDelete = JSON.parse(body).items.map((x, i) => x.track.uri);
          var options = {
            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
            headers: {
              Authorization: client_token
            },
            json: true,
            body: {
              tracks: toDelete.map((x, i) => ({
                "position": i,
                "uri": x
              }))
            }
          };
          request.delete(options, function (error, response, body) {
            console.log("PLAYLIST CLEARED!");
            var options = {
              url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + default_song_uri,
              headers: {
                Authorization: client_token
              }
            };
            request.post(options, function (error, response, body) {
              console.log("SONG ADDED");
              console.log(playlist_uri);
              res.json({
                user: user_id,
                playlist: playlist_id
              });
            });
          });

        });

      } else {
        var options = {
          url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
          headers: {
            Authorization: client_token
          },
          json: true,
          body: {
            "description": "DJuke.io, how jukeboxes should be.",
            "public": true,
            "name": "djukeio"
          }
        };
        request.post(options, function (error, response, body) {
          var playlist_id = body.id;
          var playlist_uri = body.uri;
          console.log(body);
          console.log("CREATED!");
          var options = {
            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks?uris=' + default_song_uri,
            headers: {
              Authorization: client_token
            }
          };
          request.post(options, function (error, response, body) {
            console.log("SONG ADDED");
            console.log(playlist_uri);
            res.json({
              user: user_id,
              playlist: playlist_id
            });
          });

        });
      }
    });
  });
}

function confirmExpectedPlaylistPlaying(client_token, user_id, playlist_id, expected_uri, res) {
  console.log("client token", client_token);
  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
     console.log("what", body);
    console.log("expected_uri", expected_uri);
    console.log("body context", body.context.uri);
    if(body.context.uri === expected_uri){
        res.json({ confirm_status:  true});
      } else{
      res.json({ confirm_status:  false});
    }

  });
}

function getSongInfo(client_token, song_id, cb) {
  console.log(client_token);
  console.log("FFUUUCCCCCJKKKK");
  var options = {
    url: "https://api.spotify.com/v1/tracks/" + song_id,
    headers: {
      Authorization: client_token
    },
    json: true
  };
  request.get(options, function (error, response, body) {
    cb({
      title: body.name,
      duration: body.duration_ms,
      artist: body.artists.map(x => x.name).join(", "),
      thumbnail: body.album.images[0].url,
      id: song_id
    });
  })
}

function msToMinutes(ms) {
  var totalSeconds = parseInt(ms / 1000);
  var seconds = totalSeconds % 60;
  var minutes = (totalSeconds - seconds) / 60;
  return '' + minutes + ':' + seconds;
}

module.exports = {
  pauseSong,
  playSong,
  nextSong,
  prevSong,
  seekSong,
  getPlayerInfo,
  getClientInfo,
  getClientPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  SpotifyUserInitialization,
  confirmExpectedPlaylistPlaying,
  getSongInfo,
  msToMinutes,
  addTrackToPlaylistFIRST
}
