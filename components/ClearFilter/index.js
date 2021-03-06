import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

export class ClearFilter extends Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div title='Clear Filters' onClick={this.props.onClick} className={classnames(style.clearBtn, this.props.className)} />
        );
    }
}

ClearFilter.propTypes = {
    show: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

ClearFilter.defaultProps = {
    show: false
};

export default ClearFilter;
