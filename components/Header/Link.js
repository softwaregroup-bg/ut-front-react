import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default class TabLink extends React.Component {
    render() {
        let {wideMatch, children, ...propsLeft} = this.props;

        return (
            <NavLink {...propsLeft} exact={!wideMatch}>
                {children}
            </NavLink>
        );
    }
}

TabLink.propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    wideMatch: PropTypes.bool,
    children: PropTypes.any
};

TabLink.contextTypes = {
    router: PropTypes.object.isRequired
};
