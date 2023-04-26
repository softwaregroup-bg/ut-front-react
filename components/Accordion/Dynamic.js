import React from 'react';
import PropTypes from 'prop-types';
import Box from './../Box/Dynamic';

const Accordion = React.createClass({
    propTypes: {
        children: PropTypes.node.isRequired,
        title: PropTypes.node,
        collapsed: PropTypes.bool,
        className: PropTypes.string,
        fullWidth: PropTypes.bool
    },
    getInitialState: function() {
        return { collapsed: this.props.collapsed || false };
    },
    handleToggle: function() {
        this.setState({ collapsed: !this.state.collapsed });
    },
    render() {
        return (
            <Box title={this.props.title} showAccordeon {...this.props} collapsed={this.state.collapsed} onToggle={this.handleToggle}>
                {this.props.children}
            </Box>
        );
    }
});

export default Accordion;
