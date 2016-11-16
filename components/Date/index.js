import React from 'react';

const Date = React.createClass({
    propTypes: {
        children: React.PropTypes.string
    },
    contextTypes: {
        dateFormat: React.PropTypes.func
    },
    render: function() {
        var children = this.props.children;
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
