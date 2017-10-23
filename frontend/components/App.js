import React from 'react';
import { connect } from 'react-redux';

import io from 'socket.io-client';
import ip from 'ip';

// imported components
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

import { updateQueue } from '../actions/index';

// class component
class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const socket = io("http://localhost:8228")
    socket.on("QUEUE_UPDATED", data => {
      this.props.onUpdateQueue(data)
    })
  }

  render() {
    return (
      <div className={'container'}>
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateQueue: (newQueue) => dispatch(updateQueue(newQueue)),
  };
};

export default connect(null, mapDispatchToProps)(App);
