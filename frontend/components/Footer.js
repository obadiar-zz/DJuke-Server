import React from 'react';
import { connect } from 'react-redux';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import { clearAll } from '../actions/index';

class Footer extends React.Component {
  render() {
    return (
      <Toolbar className={'footer'}>
        <ToolbarGroup>
          <img
            src='https://files.slack.com/files-pri/T6THJ5A4Q-F7N0CS0DT/djuke-logo-dark.png'
            className={'logo'}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClearAll: () => dispatch(clearAll()),
  };
};

export default connect(null, mapDispatchToProps)(Footer);
