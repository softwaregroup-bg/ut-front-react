import React, { Component, PropTypes } from 'react';
import { propTypeField } from '../../common';
import style from './styles.css';

export default class VerticalHeader extends Component {
    getStyle(name) {
        return this.props.externalStyle[name] || style[name];
    }
    renderTitle(title) {
        return (<span className={this.getStyle('verticalHeaderSpan')}>
            {title}
        </span>);
    }
    render() {
        return (
            <th className={this.getStyle('gridHeaderTrSpanColumnNotLast')} rowSpan={this.props.value.children.length}>
                {this.renderTitle(this.props.value.title)}
            </th>
        );
    }
}

VerticalHeader.propTypes = {
    value: PropTypes.object,
    recordIndex: PropTypes.number,
    field: PropTypes.object,
    verticalField: propTypeField,
    externalStyle: PropTypes.object
};

VerticalHeader.defaultProps = {
};
