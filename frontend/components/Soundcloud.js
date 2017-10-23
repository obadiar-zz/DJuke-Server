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

class Soundcloud extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillMount() {
  //   fetch('http://localhost:3000/?token=' + this.props.spotify.token, {
  //     method: 'get',
  //   })
  //   .then(resp => resp.json())
  //   .then(resp => {
  //     this.props.onSpotifyMount(resp.user, resp.playlist)
  //   })
  //   .catch(error => {console.log(error)})
  // }
  //
  // handleClick() {
  //   console.log('click');
  //   fetch('http://localhost:3000/continue/?token=' + this.props.spotify.token + '&user=' + this.props.spotify.user + '&playlist=' + this.props.spotify.playlist, {
  //     method: 'get',
  //   })
  //   .then(resp => resp.json())
  //   .then(resp => {
  //     console.log(resp);
  //     this.props.onSpotifyConfirm(resp.confirm_status)
  //   })
  //   .catch(error => {console.log(error)})
  // }

  render() {
    return (
      <Paper
        className="card"
        zDepth={4}
        >
        <Card>
          <CardHeader
            title="Soundcloud"
            subtitle={this.props.spotify.confirm_status ?
              "Confirmed" :
              "Please press the play button."
            }
          />
          <iframe
            id="soundcloud"
            className={'widget'}
            scrolling="no"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/34019569&amp;color=0066cc"
            frameBorder="0"
            allowTransparency={true}
          />
          <CardActions>
            <RaisedButton
              label="Connect to Soundcloud"
              primary={true}
              width="300"
              onClick={() => this.handleClick()}
            />
          </CardActions>
        </Card>
      </Paper>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    spotify: state.spotify,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSpotifyMount: (user, playlist) => dispatch(spotifyMount(user, playlist)),
    onSpotifyConfirm: (confirm_status) => dispatch(spotifyConfirm(confirm_status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Soundcloud);
