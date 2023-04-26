import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from '../style.css';

class Heading extends Component {
    render() {
        return (
            <div className={classnames(style.rowWrap, style.heading)} style={this.props.styles}>
                {this.props.value}
            </div>
        );
    }
}

Heading.propTypes = {
    value: PropTypes.string,
    styles: PropTypes.object
};

Heading.defaultProps = {
    value: undefined,
    styles: {}
};

export default Heading;
