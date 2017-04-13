import React, { PropTypes } from 'react';
import Box from './../Box/Dynamic';

const Accordion = React.createClass({
    propTypes: {
        children: PropTypes.node.isRequired,
        title: PropTypes.node,
        collapsed: PropTypes.bool,
        className: PropTypes.string,
        fullWidth: PropTypes.bool
    },
    handleToggle: function() {
        this.setState({ collapsed: !this.state.collapsed });
    },
    render() {
        return (
          <Box title={this.props.title} showAccordeon {...this.props} onToggle={this.handleToggle}>
            {this.props.children}
          </Box>
        );
    }
});

export default Accordion;
