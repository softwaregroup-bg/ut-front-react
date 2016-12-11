import React, { Component, PropTypes } from 'react';
import {fromJS, Map} from 'immutable';
import {propTypeFields} from '../common';
import Field from './Field';
import MultiSelectField from './SpecialFields/MultiSelect';
import style from './styles.css';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
    }
    componentWillMount() {
        this.setState({orderDirections: {}});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.updateOrderState) {
            // uppercase the sort string
            var newOrderDirections = {};
            for (var key in nextProps.updateOrderState) {
                newOrderDirections[key] = nextProps.updateOrderState[key].toUpperCase();
            }
            this.setState({orderDirections: newOrderDirections});
        }
    }
    getStyle(name) {
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }
    handleOrder(fieldName) {
        // fat and easy to read, order change
        if (~this.props.orderBy.indexOf(fieldName)) {
            let orderDirection = this.state.orderDirections[fieldName] || '';
            let orderDirectionOld = orderDirection;

            if (orderDirection === '') {
                orderDirection = 'ASC';
            } else if (orderDirection === 'ASC') {
                orderDirection = 'DESC';
            } else {
                orderDirection = '';
            }
            if (this.props.multiOrder) {
                this.state.orderDirections[fieldName] = orderDirection;
            } else {
                this.state.orderDirections = {[fieldName]: orderDirection};
            }
            this.props.handleOrder({field: fieldName, new: orderDirection, old: orderDirectionOld, all: this.state.orderDirections});
            this.setState(this.state);
        }
    }
    render() {
        let fields = fromJS(this.props.fields);
        if (this.props.multiSelect) {
            fields = fields.unshift(Map({internal: 'multiSelect'}));
        }

        return (
            <thead>
                <tr className={this.getStyle('gridHeaderTr')}>
                    {fields.map((field, idx) => (!field.get('internal')
                        ? <Field externalStyle={this.props.externalStyle} key={idx} field={field.toJS()} handleOrder={this.handleOrder} orderDirection={this.state.orderDirections[field.get('name')]} />
                        : <MultiSelectField field={field.toJS()} key={idx} handleCheckboxSelect={this.props.handleHeaderCheckboxSelect} isChecked={this.props.isChecked} />
                    ))}
                </tr>
            </thead>
        );
    }
}

Header.propTypes = {
    externalStyle: PropTypes.object,
    fields: propTypeFields,
    // fields for which order is enabled e.g. ['a', 'b', 'x']
    orderBy: PropTypes.array,
    updateOrderState: PropTypes.object,
    // if true will allow order by multiple columns
    multiOrder: PropTypes.bool,
    handleOrder: PropTypes.func,
    isChecked: PropTypes.bool,
    handleHeaderCheckboxSelect: PropTypes.func,
    multiSelect: PropTypes.bool
};

Header.defaultProps = {
    fields: [],
    orderBy: [],
    updateOrderState: undefined,
    handleOrder: (props) => ({})
};

Header.contextTypes = {
    implementationStyle: PropTypes.object
};
