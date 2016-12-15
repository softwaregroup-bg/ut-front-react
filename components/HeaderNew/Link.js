import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { getLink } from 'ut-front/react/routerHelper';
import style from './styles.css';

export default class NavigationLink extends Component {
    render() {
        const { to, params, className, children, activeClassName } = this.props;

        return (
            <Link
              to={getLink(to, params)}
              className={className}
              activeClassName={activeClassName}
              activeStyle={style.navigationLinkActive} >
                {children}
            </Link>
        );
    }
};

NavigationLink.propTypes = {
    to: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    children: PropTypes.any,
    params: PropTypes.object
};

NavigationLink.defaultProps = {
    params: {}
};
