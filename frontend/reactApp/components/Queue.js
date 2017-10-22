import React from 'react';
import { connect } from 'react-redux';

import Song from './Song'

class Queue extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={'queue'}>
        {this.props.songList.list.map((song, index) =>
          <Song
            key={song.id}
            id={song.id}
            index={index+1}
            title={song.title}
            artist={song.artist}
            duration={song.duration}
            upvotes={song.upvotes}
            payment={song.payment}
            thumbnail={song.thumbnail}
            time={song.time}
          />
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    songList: state.songList,
  }
};

export default connect(mapStateToProps, null)(Queue);
