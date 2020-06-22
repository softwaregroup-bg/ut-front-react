import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { getLink } from '../../routerHelper';

export default class NavigationLink extends Component {
    render() {
        const { to, useRawTo, params, className, children, activeClassName, style } = this.props;
        const { onClick } = this.props;

        return (
            <NavLink
                to={useRawTo ? to : getLink(to, params)}
                className={className}
                activeClassName={activeClassName}
                onClick={onClick}
                style={style} >
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
