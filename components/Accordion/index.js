import PropTypes from 'prop-types';
import React from 'react';
import Box from './../Box';

class Accordion extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.node,
        collapsed: PropTypes.bool,
        className: PropTypes.string,
        fullWidth: PropTypes.bool,
        arrowDirection: PropTypes.object
    };

    state = { collapsed: this.props.collapsed || false };

    handleToggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    componentWillReceiveProps(nextProps) {
        if (this.state.collapsed !== nextProps.collapsed) {
            this.setState({ collapsed: nextProps.collapsed });
        }
    }

    render() {
        return (
            <Box title={this.props.title} arrowDirection={this.props.arrowDirection} showAccordeon {...this.props} collapsed={this.state.collapsed} onToggle={this.handleToggle}>
                {this.props.children}
            </Box>
        );
    }
}

export default Accordion;
