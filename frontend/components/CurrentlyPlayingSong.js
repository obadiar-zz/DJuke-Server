import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
  CardTitle,
  CardMedia,
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Modal from 'react-modal';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

import io from 'socket.io-client';

class CurrentlyPlayingSong extends React.Component {
  constructor(props) {
    super(props)
    const socket = io("http://localhost:8228")
    this.state = {
      open: false,
      snack: false,
      socket,
      completed: 0,
      cur_song_id: -1,
      timer: ""
    }
  }

  time() {
    // takes a string representation of a date Object
    let newTime = this.props.time.split(' ')[4];
    let hour = parseInt(newTime.slice(0, 2))
    if (hour > 12) {
      hour = hour - 12;
      return String(hour) + newTime.slice(2) + 'pm'
    }
    else return newTime + "am"
  }

  handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };

  handleDelete(id) {
    this.setState({
      open: false,
      snack: true,
    })
    console.log('clicked');
    this.state.socket.emit("REMOVE_SONG", {id,})
  }

  handleRequestClose() {
    this.setState({
      snack: false,
    })
  }

  componentDidMount() {
    this.timer = setInterval(this.increment.bind(this), 1000);
  }

  componentWillUnmount() {

    clearTimeout(this.timer);
  }

  increment() {
    this.setState({completed: this.state.completed + 1});
  }

  render() {
    const actions = [
      <FlatButton
        label="Delete"
        secondary={true}
        onClick={() => this.handleDelete(this.props.id)}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.handleClose()}
      />,
    ];

    if( this.props.id !== this.state.cur_song_id){
      this.setState({
        cur_song_id: this.props.id,
        completed: 0,
      })
    }
    console.log(this.state);

    // Calculate the time elapsed
    var minutes = Math.floor(this.state.completed/60)
    var seconds = this.state.completed%60
    if( seconds < 10){
      seconds = "0"+seconds
    }
    var timeElapsed = minutes+":"+seconds;
    const percentage = (this.state.completed/parseInt(this.props.duration)) * 100;
    return (
      <Paper
        className={'currentlyPlayingSong'}
        zDepth={4}
        >
        <div
          className={'ugh-mediaPlayer'}
          onClick={() => this.handleOpen()}
          >
          <div className="overall-container-mediaPlayer">
            <div className={'image-thumbNail-left'}>
          <img
            className={'thumbnail-mediaPlayer'}
            src={this.props.thumbnail}
          />
        </div>
        <div className={'everything-else-right'}>
          <div className={'mediaTitle-container'}>
            <h1 className={'mediaTitle'}>Now Playing</h1>
          </div>
          <div className={'mediaPlayer-container'}>
            <div className={'mediaPlayer-container-top'}>
              <span className={'title-mediaPlayer'}>
                {this.props.title} <span className={'artist-mediaPlayer'}>
                  {this.props.artist}
                </span>
              </span>

          <div >
            <FlatButton
              label="Pause"
              primary={true}
              className={'mediaPlayer-button'}
              onClick={() => console.log("play")}
            />
            <FlatButton
              label="Next"
              primary={true}
              className={'mediaPlayer-button'}
              onClick={() => console.log("next")}
            />
          </div>
          </div>
          <div className={'mediaPlayer-container-middle'}>
            <div className={'song-progress-container'}>
              <LinearProgress mode="determinate" value={percentage}/>
            </div>
          </div>
            <div className={'mediaPlayer-container-bottom'}>
                <span className={'song-time-mediaPlayer'} >{timeElapsed}</span>
                <span className={'song-time-mediaPlayer'} >{this.props.time}</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      </Paper>
    );
  }
};

export default CurrentlyPlayingSong;
