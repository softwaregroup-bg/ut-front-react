import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { getLink } from 'ut-front/react/routerHelper';
import styles from './styles.css';

export default class NavigationLink extends Component {
    render() {
        const { to, params, className, children, activeClassName, style } = this.props;
        const { onClick } = this.props;

        return (
            <Link
              to={getLink(to, params)}
              className={className}
              activeClassName={activeClassName}
              activeStyle={styles.navigationLinkActive}
              onClick={onClick}
              style={style} >
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
    params: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func
};

NavigationLink.defaultProps = {
    params: {}
};
