import React, { Component, PropTypes } from 'react';
import {fromJS, Map} from 'immutable';
import {propTypeFields} from '../common';
import Field from './Field';
import MultiSelectField from './SpecialFields/MultiSelect';
import GlobalMenu from './SpecialFields/GlobalMenu';
import style from './styles.css';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
    }
    componentWillMount() {
        this.setState({orderDirections: {}});
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
    getFields() {
        let fields = fromJS(this.props.fields);
        if (this.props.multiSelect) {
            fields = fields.unshift(Map({internal: 'multiSelect'}));
        }
        if (this.props.globalMenu) {
            fields = fields.push(Map({internal: 'globalMenu'}));
        }
        return fields;
    }
    getRawFields() {
        return fromJS(this.props.fields).map((v) => {
            if (v.get('visible') === undefined) {
                return v.set('visible', true);
            }
            return v;
        }).toJS();
    }
    render() {
        let fields = this.getFields();

        return (
            <thead>
                <tr className={this.getStyle('gridHeaderTr')}>
                    {fields.map((field, idx) => {
                        if (!field.get('internal')) {
                            return <Field externalStyle={this.props.externalStyle} transformCellValue={this.props.transformCellValue} key={idx} field={field.toJS()} handleOrder={this.handleOrder} orderDirection={this.state.orderDirections[field.get('name')]} />;
                        } else if (field.get('internal') === 'multiSelect') {
                            return <MultiSelectField field={field.toJS()} key={idx} handleCheckboxSelect={this.props.handleHeaderCheckboxSelect} isChecked={this.props.isChecked} />;
                        } else if (field.get('internal') === 'globalMenu') {
                            return <GlobalMenu field={field.toJS()} key={idx} fields={this.getRawFields()} toggleColumnVisibility={this.props.toggleColumnVisibility} />;
                        }
                    })}
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
    // if true will allow order by multiple columns
    globalMenu: PropTypes.bool,
    multiOrder: PropTypes.bool,
    handleOrder: PropTypes.func,
    transformCellValue: PropTypes.func,
    isChecked: PropTypes.bool,
    handleHeaderCheckboxSelect: PropTypes.func,
    toggleColumnVisibility: PropTypes.func,
    multiSelect: PropTypes.bool
};

Header.defaultProps = {
    fields: [],
    orderBy: [],
    handleOrder: (props) => ({})
};

Header.contextTypes = {
    implementationStyle: PropTypes.object
};
