import React from 'react';

// import components to render
import SoundCloudAudio from 'soundcloud-audio';
import io from 'socket.io-client';

var CLIENT_ID = '309011f9713d22ace9b976909ed34a80';

const clientId = CLIENT_ID;
const scPlayer = new SoundCloudAudio(CLIENT_ID);

// var playQueue = [];

class SoundCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.socket = io("http://localhost:8228")
    this.socket.on('SOUNDCLOUD_PLAY_SONG', function (data) {
      console.log('RECEIVED SOUNDCLOUD PLAY EVENT')
      this.playSong(data)
    }.bind(this))
  }

  playSong(song) {
    var trackURL = song.url;

    scPlayer.resolve(trackURL, function (track) {
      console.log('Resolving: "', track.title + '"..')

      // once track is loaded it can be played
      this.socket.emit('SONG_STARTED', song)
      scPlayer.play();
      // stop playing track and keep silence
      // scPlayer.pause();
      setTimeout(() => emitSongOver(), 6000)
      var emitSongOver = function () {
        this.socket.emit('SONG_OVER', song)
      }.bind(this)
      // scPlayer.on('ended', function () {
      //   console.log(track.title, 'has finished playing.')
      //   playQueue.shift();
      //   if (playQueue.length !== 0)
      //     this.playSong(playQueue[0]);
      // }.bind(this))
    }.bind(this));
  }
  render() {
    return null
  }
};

export default SoundCloud;
