import PropTypes from 'prop-types';
import React from 'react';

class Date extends React.Component {
    static propTypes = {
        children: PropTypes.string
    };

    static contextTypes = {
        dateFormat: PropTypes.func
    };

    render() {
        var children = this.props.children;
        if (typeof this.context.dateFormat === 'function') {
            this.text = this.context.dateFormat(this.props.children);
            children = this.text;
        }
        return (
            <span>{children}</span>
        );
    }
}

export default Date;
