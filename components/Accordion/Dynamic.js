import PropTypes from 'prop-types';
import React from 'react';
import Box from './../Box/Dynamic';

class Accordion extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.node,
        collapsed: PropTypes.bool,
        className: PropTypes.string,
        fullWidth: PropTypes.bool
    };

    state = { collapsed: this.props.collapsed || false };

    handleToggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        return (
            <Box title={this.props.title} showAccordeon {...this.props} collapsed={this.state.collapsed} onToggle={this.handleToggle}>
                {this.props.children}
            </Box>
        );
    }
}

export default Accordion;
