import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default class TabLink extends React.Component {
    render() {
        let {to, className, children} = this.props;
        let {wideMatch, ...propsLeft} = this.props;
        let pathname = typeof to === 'object' ? to.pathname : to;
        let isActive = this.context.router.isActive(pathname, !wideMatch);

        return (
            <Link {...propsLeft} className={className} activeClassName={isActive ? this.props.activeClassName : ''}>
                {children}
            </Link>
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
