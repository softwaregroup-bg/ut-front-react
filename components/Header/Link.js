import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default class TabLink extends React.Component {
    render() {
        let {to, className, activeClassName, children} = this.props;
        let {wideMatch, ...propsLeft} = this.props;
        let currentClassName = '';
        let pathname = typeof to === 'object' ? to.pathname : to;
        if (this.context.router.isActive(pathname, !wideMatch)) {
            currentClassName = classnames(className, activeClassName);
        } else {
            currentClassName = className;
        }
        debugger;
        return (
            <Link {...propsLeft} className={currentClassName} activeClassName={this.props.activeClassName}>
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
