import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

// import components to render
import Spotify from './Spotify'
import Soundcloud from './Soundcloud'
import Queue from './Queue'
import MediaPlayer from './MediaPlayer'

class Body extends React.Component {
  constructor() {
    super();
    this.state = {
      spotifyConfirmed: false
    }
  }

  spotifyConfirm() {
    this.setState({
      spotifyConfirmed: true
    })
  }

  render() {
    return (
      <div className={'container body'}>
        <div className='clients'>
          {
            this.state.spotifyConfirmed ? <MediaPlayer /> : <Spotify confirm={this.spotifyConfirm.bind(this)}/>
          }


        </div>
        <Queue />
      </div>
    );
  }
};

export default Body;
