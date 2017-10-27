import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

// import components to render
import Spotify from './Spotify'
import SoundCloud from './Soundcloud'
import Queue from './Queue'

var playQueue = [];

class Body extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.queue)
  }
  render() {
    return (
      <div className={'container body'}>
        <div className='clients'>
          <Spotify />
          <SoundCloud queue={this.props.queue} currentlyPlaying={this.props.currentlyPlaying} />
        </div>
        <Queue />
      </div>
    );
  }
};

export default Body;
