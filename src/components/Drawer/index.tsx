import * as React from 'react';
import * as classnames from 'classnames';
import { Component, ReactChildren, ReactChild } from 'react';
import { Dispatch } from 'redux';

const toggleIconImg = require('@src/images/icons/ic-close-open-details.png');
const toggleIconImgSvg = require('@src/images/icons/ic-close-open-details.png');

interface DrawerProps {
  isOpen: boolean;
  children: ReactChildren | ReactChild;
}

interface DrawerCallbacks {
  onToggle: () => void;
}

class Drawer extends Component<DrawerProps & DrawerCallbacks> {
  render() {
    return (
      <nav className="navigation-left no-print">
        <span className="trigger no-print" onClick={this.props.onToggle}>
          <img src={toggleIconImg} />
        </span>
        <div
          className={classnames('controller', {
            open: this.props.isOpen
          })}
        >
          <div className="content">{this.props.children}</div>
        </div>
      </nav>
    );
  }
}

export default Drawer;
