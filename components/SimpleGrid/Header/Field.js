import React, { Component, PropTypes } from 'react';
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
        let orderByStyle = [this.getStyle('girdOrderHeadingStyle')];
        let {orderDirection} = this.props;

        if (orderDirection) {
            orderByStyle.push(this.getStyle('girdOrderHeadingStyle' + orderDirection));
        }
        return (
            <th onTouchTap={this.handleOrder}>
                <span className={classnames.apply(undefined, orderByStyle)}>{this.props.field.title || ''}</span>
            </th>
        );
    }
}

Field.propTypes = {
    field: propTypeField,
    externalStyle: PropTypes.object,
    orderDirection: PropTypes.string,
    handleOrder: PropTypes.func
};

Field.defaultProps = {
    field: {},
    orderBy: [],
    handleOrder: (field) => ({})
};

Field.contextTypes = {
    implementationStyle: PropTypes.object
};
