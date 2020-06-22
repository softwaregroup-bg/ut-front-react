import PropTypes from 'prop-types';
import React from 'react';

class Number extends React.Component {
    static propTypes = {
        children: PropTypes.string
    };

    static contextTypes = {
        numberFormat: PropTypes.func
    };

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
}

export default Number;
