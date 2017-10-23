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
import Snackbar from 'material-ui/Snackbar';

import { spotifyMount } from '../actions/index';
import { spotifyConfirm } from '../actions/index';

class Spotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  componentWillMount() {
    console.log("WHAT", this.props.spotify);
    fetch('http://localhost:8228/registerHostSpotify?token=' + this.props.spotify.token, {
      method: 'get',
    })
    .then(resp => resp.json())
    .then(resp => {
      this.props.onSpotifyMount(resp.user, resp.playlist)
    })
    .catch(error => {console.log(error)})
  }

  handleClick() {
    console.log('click');
    fetch('http://localhost:8228/continueHostSpotify/?token=' + this.props.spotify.token + '&user=' + this.props.spotify.user + '&playlist=' + this.props.spotify.playlist, {
      method: 'get',
    })
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      this.props.onSpotifyConfirm(resp.confirm_status)
      this.setState({
        open: true,
      })
    })
    .catch(error => {console.log(error)})
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <Paper
        className="card card-spotify"
        zDepth={4}
        >
        <Card>
          <CardHeader
            title="Spotify"
            subtitle={this.props.spotify.confirm_status ?
              "Confirmed" :
              "Please press the play button."
            }
          />
          <iframe
            className="widget"
            src={"https://embed.spotify.com/?uri=spotify:user:" + this.props.spotify.user + ":playlist:" + this.props.spotify.playlist}
            frameBorder="0"
            allowTransparency="true"
          />
          <CardActions>
            <RaisedButton
              label="Connect to Spotify"
              primary={true}
              width="300"
              onClick={() => this.handleClick()}
            />
          </CardActions>
        </Card>
        <Snackbar
          open={this.state.open}
          message="Connected to Spotify"
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Spotify);
