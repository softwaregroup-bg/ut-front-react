import React from 'react';
import { Link } from 'react-router';

export default const Link = ({
    className,
    activeClassName,
    to
}) => {
  debugger;
    return (
        <Link
            to={to}
            className={className}
            activeClassName={activeClassName} >
            {this.props.children}
        </Link>
    );
};
