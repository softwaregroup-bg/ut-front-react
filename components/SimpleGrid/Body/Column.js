/* eslint-disable react/no-unknown-property */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypeField } from '../common';

export default class Column extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name];
    }

    handleClick(value) {
        return () => {
            this.props.handleClick(this.props.data, this.props.field, value, this.props.recordIndex);
        };
    }

    render() {
        if (this.props.field.visible === false) {
            return false;
        }
        const reMapKey = (this.props.data[this.props.field.name] === undefined) ? '' : this.props.data[this.props.field.name];
        let value = reMapKey;
        if (typeof (this.props.field.dataReMap) !== 'undefined') {
            value = this.props.field.dataReMap[reMapKey];
        }
        const fieldClasses = [];
        if (this.props.field.className) {
            fieldClasses.push(this.props.field.className);
        }
        if (this.props.field.inSpanStyle) {
            fieldClasses.push(this.getStyle(this.props.field.inSpanStyle));
        }

        return (
            <td onTouchTap={this.handleClick(value)} style={this.props.field.style} className={fieldClasses.join(' ')} colSpan={this.props.colspan}>
                {this.props.transformValue(value, this.props.field, this.props.data, false, this.props.recordIndex)}
            </td>
        );
    }
}

Column.propTypes = {
    externalStyle: PropTypes.object,
    field: propTypeField,
    data: PropTypes.object,
    recordIndex: PropTypes.number,
    colspan: PropTypes.number,
    transformValue: PropTypes.func,
    handleClick: PropTypes.func
};

Column.defaultProps = {
    field: {},
    data: {},
    handleClick: (record, field, value, recordIndex) => {},
    transformValue: (value, field, data, isHeader) => { return value; }
};

Column.contextTypes = {
    implementationStyle: PropTypes.object
};
