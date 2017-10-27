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
      this.props.onUpdateQueue(data)
    })
  }

  componentWillRecieveProps(props) {
    console.log('STATE:', this.props.currentlyPlayingSong)
  }

  render() {
    return (
      <div className={'container'}>
        <Header />
        <Body queue={this.props.songList} setNewSongPlaying={(song) => this.props.newSongPlaying(song)} />
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
    newSongPlaying: (song) => dispatch(newSongPlaying(song))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
