import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
// import components to render
import Spotify from './Spotify'
import Soundcloud from './Soundcloud'
import Queue from './Queue'
import io from 'socket.io-client';
import { sendSpotifyToken } from '../actions/index';
class Body extends React.Component {
  constructor(props) {
    super(props);
    const socket = io("http://localhost:8228")
    this.state = {
      socket
    }

    this.state.socket.on('SEND_TOKEN', token => {
      this.props.tokenSend(token);
    })
  }
  render() {
    return (
      <div className={'container body'}>
        <div className='clients'>
          <Spotify token={this.props.token}/>
          <Soundcloud />
        </div>
        {this.props.token ? <div></div> :  <div style={{textAlign: 'center'}}>
                  <a className="spotify-login" href="/auth/spotify" style={{display: 'inline-block', fontFamily: 'Arial'}}><i style={{color: '#2ebd59', fontSize: '18px'}} className="fa fa-spotify" aria-hidden="true"></i> Log in with Spotify</a>
                </div>}

        <Queue />
      </div>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    token: state.spotify.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tokenSend: (token) => dispatch(sendSpotifyToken(token)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Body);
