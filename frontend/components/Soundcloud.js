import React from 'react';

// import components to render
import SoundCloudAudio from 'soundcloud-audio';
import io from 'socket.io-client';

var CLIENT_ID = '309011f9713d22ace9b976909ed34a80';

const clientId = CLIENT_ID;
const scPlayer = new SoundCloudAudio(CLIENT_ID);

var playQueue = [];

class SoundCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setInterval(this.nextSong.bind(this), 5000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.queue.list.length !== nextProps.queue.list.length) {
      console.log('SONG LIST:', nextProps.queue.list)
      playQueue = nextProps.queue.list;
      // if (this.props.queue.list.length === 0) {
      //   this.playSong(playQueue[0])
      // }
    }
  }

  nextSong() {
    const socket = io("http://localhost:8228")
    if (playQueue.length !== 0) {
      this.playSong(playQueue[0]);
      socket.emit("REMOVE_SONG", playQueue[0]);
    }
    playQueue.shift();
  }

  playSong(song) {
    var trackURL = song.url;

    scPlayer.resolve(trackURL, function (track) {
      console.log('Resolving:', track.title + '..')

      // once track is loaded it can be played
      scPlayer.play();

      // stop playing track and keep silence
      // scPlayer.pause();

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
