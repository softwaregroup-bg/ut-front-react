import React from 'react';
import PropTypes from 'prop-types';

const Number = React.createClass({
    propTypes: {
        children: PropTypes.string
    },
    contextTypes: {
        numberFormat: PropTypes.func
    },
    render() {
        let children = this.props.children;
        if (typeof this.context.numberFormat === 'function') {
            this.text = this.context.numberFormat(this.props.children);
            children = this.text;
        }
        return (
            <span>{children}</span>
        );
    }
});

export default Number;
