import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

// import components to render
import Spotify from './Spotify'
import Soundcloud from './Soundcloud'
import Queue from './Queue'

class Body extends React.Component {
  render() {
    return (
      <div className={'container body'}>
        <div className='clients'>
          <Spotify />
          <Soundcloud />
        </div>
        <div>
          <a className="spotify-login" href="/auth/spotify" style={{display: 'inline-block'}}><i className="fa fa-spotify" aria-hidden="true"></i> Log in with Spotify</a>
        </div>
        <Queue />
      </div>
    );
  }
};

export default Body;
