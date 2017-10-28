import React from 'react';
import { connect } from 'react-redux';

import io from 'socket.io-client';
import ip from 'ip';

// imported components
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

import { updateQueue, newSongPlaying } from '../actions/index';

// class component
class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const socket = io("http://localhost:8228")
    socket.on("QUEUE_UPDATED", data => {
      // if (data.currentlyPlaying) {
      //   this.props.onNewSongUpdate(data.currentlyPlaying)
      // }
      this.props.onUpdateQueue(data)
    })
    socket.on('SOUNDCLOUD_PLAY_SONG', function (data) {
      this.props.onNewSongUpdate(data)
    }.bind(this))
    socket.on('SPOTIFY_PLAY_SONG', function (data) {
      this.props.onNewSongUpdate(data)
    }.bind(this))
  }

  render() {
    return (
      <div className={'container'}>
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    songList: state.songList,
    currentlyPlayingSong: state.currentlyPlayingSong
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateQueue: (newQueue) => dispatch(updateQueue(newQueue)),
    onNewSongUpdate: (song) => dispatch(newSongPlaying(song)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
