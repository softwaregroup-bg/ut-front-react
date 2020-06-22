import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { propTypeField } from '../common';
import style from './styles.css';

export default class Field extends Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
    }

    getStyle(name) {
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }

    handleOrder() {
        this.props.handleOrder(this.props.field.name);
    }

    render() {
        if (this.props.field.visible === false) {
            return false;
        }
        const styles = [this.getStyle('girdOrderHeadingStyle')];
        const girdHeadingStyle = [this.getStyle('girdHeading')];
        const {orderDirection} = this.props;

        if (orderDirection) {
            styles.push(this.getStyle('girdOrderHeadingStyle' + orderDirection.toUpperCase()));
        }
        if (this.props.field.inSpanStyle) {
            this.getStyle(this.props.field.inSpanStyle) && girdHeadingStyle.push(this.getStyle(this.props.field.inSpanStyle));
        }

        const thStyle = ['verticalSpanField', 'verticalField'].includes(this.props.field.name) ? this.getStyle('gridHeaderTrSpanColumnNotLast') : undefined;
        return (
            <th className={thStyle || girdHeadingStyle.join(' ')}>
                <span className={classnames(style.thTitle, this.getStyle('gridHeadingInner'))} onClick={this.handleOrder}>
                    {this.props.transformCellValue(this.props.field.title || '', this.props.field, undefined, true)}
                    <span className={classnames.apply(undefined, styles)} />
                </span>
            </th>
        );
    }
}

Field.propTypes = {
    field: propTypeField,
    externalStyle: PropTypes.object,
    orderDirection: PropTypes.string,
    handleOrder: PropTypes.func,
    transformCellValue: PropTypes.func
};

Field.defaultProps = {
    field: {},
    orderBy: [],
    handleOrder: (field) => ({}),
    transformCellValue: (value, field, data, isHeader) => (value)
};

Field.contextTypes = {
    implementationStyle: PropTypes.object
};
