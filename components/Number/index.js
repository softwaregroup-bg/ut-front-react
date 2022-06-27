import React from 'react';

const Number = React.createClass({
    propTypes: {
        children: React.PropTypes.string
    },
    contextTypes: {
        numberFormat: React.PropTypes.func
    },
    render: function() {
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
