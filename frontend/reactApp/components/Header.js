import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarSeparator,
} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';

import { clearAll } from '../actions/index';

class Header extends React.Component {
  render() {
    return (
      <Toolbar className={"header"}>
        <ToolbarGroup>
          <ToolbarTitle text={'Welcome to DJuke'} />
        </ToolbarGroup>
        <ToolbarGroup firstChild={true}>
          <RaisedButton label="Settings"/>
          <RaisedButton label="Contact Us"/>
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
          </IconMenu>
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

export default connect(null, mapDispatchToProps)(Header);
