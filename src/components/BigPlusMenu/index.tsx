import * as React from 'react';
import * as classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ReactChildren, ReactChild } from 'react';

interface BigPlusMenuProps {
  isOpen: boolean;
  children: ReactChildren | ReactChild | ReactChild[];
}

interface BigPlusMenuCallbacks {
  onToggle: () => void;
}

const BigPlusMenu = (props: BigPlusMenuProps & BigPlusMenuCallbacks) => (
  <div
    onClick={props.onToggle}
    className={classnames('big-plus-menu', 'no-print', {
      'big-plus-menu--open': props.isOpen
    })}
  >
    <ul className="big-plus-menu__list">{props.children}</ul>
  </div>
);

export default BigPlusMenu;
