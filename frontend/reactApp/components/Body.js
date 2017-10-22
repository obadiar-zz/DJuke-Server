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
        <Queue />
      </div>
    );
  }
};

export default Body;
