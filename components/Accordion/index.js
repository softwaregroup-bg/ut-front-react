import React, { PropTypes } from 'react';
import Box from './../Box';

const Accordion = React.createClass({
    propTypes: {
        children: PropTypes.node.isRequired,
        title: PropTypes.node,
        collapsed: PropTypes.bool,
        className: PropTypes.string,
        fullWidth: PropTypes.bool,
        arrowDirection: PropTypes.object
    },
    getInitialState: function() {
        return { collapsed: this.props.collapsed || false };
    },
    handleToggle: function() {
        this.setState({ collapsed: !this.state.collapsed });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.collapsed !== nextProps.collapsed) {
            this.setState({ collapsed: nextProps.collapsed });
        }
    },
    render() {
        return (
          <Box title={this.props.title} arrowDirection={this.props.arrowDirection} showAccordeon {...this.props} collapsed={this.state.collapsed} onToggle={this.handleToggle}>
            {this.props.children} A
          </Box>
        );
    }
});

export default Accordion;
