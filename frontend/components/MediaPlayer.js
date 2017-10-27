import React from 'react';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import {
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';

import { spotifyMount } from '../actions/index';
import { spotifyConfirm } from '../actions/index';

import CurrentlyPlayingSong from './CurrentlyPlayingSong'

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.currentlyPlaying);
    var currentlyPlaying = this.props.currentlyPlaying !== "null" ? this.props.currentlyPlaying : {
      title: "Waiting for first track!",
      artists: " ",
      durationS: " ",
      upVotes: " ",
      payment: " ",
      thumbnail: "https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
      duration: " ",
      id: " "
    } ;

    console.log("HERE!!!", currentlyPlaying);
    return (
      <Paper
        title="Currently Playing"
        className="card"
        zDepth={4}
        >
          <CurrentlyPlayingSong
            key={""}
            id={currentlyPlaying.id}
            title={currentlyPlaying.title}
            artist={currentlyPlaying.artist}
            duration={currentlyPlaying.durationS}
            upvotes={currentlyPlaying.upVotes}
            payment={currentlyPlaying.payment}
            thumbnail={currentlyPlaying.thumbnail}
            time={currentlyPlaying.duration}
          />
      </Paper>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    currentlyPlaying: state.currentlyPlayingSong,
  }
};

export default connect(mapStateToProps, null)(MediaPlayer);
