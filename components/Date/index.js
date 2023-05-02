import React from 'react';
import PropTypes from 'prop-types';

const Date = React.createClass({
    propTypes: {
        children: PropTypes.string
    },
    contextTypes: {
        dateFormat: PropTypes.func
    },
    render() {
        let children = this.props.children;
        if (typeof this.context.dateFormat === 'function') {
            this.text = this.context.dateFormat(this.props.children);
            children = this.text;
        }
        return (
            <span>{children}</span>
        );
    }
});

export default Date;
