import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { getLink } from '../../routerHelper';
import classNames from 'classnames';
import styles from './styles.css';

function clickDisabled(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

export default class NavigationLink extends Component {
    render() {
        const { to, useRawTo, params, className, children, activeClassName, style } = this.props;
        const { onClick } = this.props;
        const linkTo = (useRawTo ? to : getLink(to, params));

        return (
            <NavLink
                to={linkTo || '#'}
                className={classNames(className, !linkTo && styles.menuDisabled)}
                activeClassName={classNames(activeClassName, !linkTo && styles.menuDisabled)}
                onClick={linkTo ? onClick : clickDisabled}
                style={style}
            >
                {children}
            </NavLink>
        );
    }
}

NavigationLink.propTypes = {
    to: PropTypes.string.isRequired,
    useRawTo: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    children: PropTypes.any,
    params: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func
};

NavigationLink.defaultProps = {
    params: {}
};

NavigationLink.contextTypes = {
    router: PropTypes.object.isRequired
};
