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

import io from 'socket.io-client';

class Song extends React.Component {
  constructor(props) {
    super(props)
    const socket = io("http://localhost:8228")
    this.state = {
      open: false,
      snack: false,
      socket,
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

    return (
      <Paper
        className="song"
        zDepth={4}
        >
        <div
          className={'ugh'}
          onClick={() => this.handleOpen()}
          >
          <img
            className={'thumbnail'}
            src={this.props.thumbnail}
          />
          <span className={'artist-container'}>
            <span className={'title'}>
              {this.props.title}
            </span>
            <span className={'artist'}>
              {this.props.artist}
            </span>
          </span>
        </div>
        <span className={'upvote-container'}>
          <span className={'likes'}>
            {"$" + this.props.payment.toFixed(2)}
          </span>
          <img
            className={'like-img'}
            src={'https://i.imgur.com/qsgZE9B.png'}
          />
          <div className={'spacer'}></div>
          <span className={'likes'}>
            {Object.keys(this.props.upvotes).length}
          </span>
          <img
            className={'like-img'}
            src={'https://i.imgur.com/g1X6dzO.png'}
          />
        </span>
        <Dialog
          title={'Delete "' + this.props.title + '"?'}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.handleClose()}
        >
        </Dialog>
        <Snackbar
          open={this.state.snack}
          message="Song Deleted"
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
      </Paper>
    );
  }
};

export default Song;
