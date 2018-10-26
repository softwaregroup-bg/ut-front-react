import React, { Component, PropTypes } from 'react';
import {fromJS, Map} from 'immutable';
import {propTypeFields} from '../common';
import Field from './Field';
import MultiSelectField from './SpecialFields/MultiSelect';
import GlobalMenu from '../../GridMenu';
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
            let orderDirection = (this.props.orderDirections && this.props.orderDirections[fieldName]) || this.state.orderDirections[fieldName] || '';
            let orderDirectionOld = orderDirection;

            if (orderDirection === '') {
                orderDirection = 'ASC';
            } else if (orderDirection.toUpperCase() === 'ASC') {
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
        if (this.props.verticalFields) {
            if (this.props.verticalFieldsVisible) {
                fields = fields.unshift(Map({internal: 'verticalField'}));
            }
            if (this.props.verticalSpanFields) {
                fields = fields.unshift(Map({internal: 'verticalSpanField'}));
            }
        }
        return fields;
    }
    getSpanFields(fields) {
        // filter child fields that not shown
        let spanFields = fromJS(this.props.spanFields).map((spanField) => {
            return spanField.update('children', (child) => {
                return child.filter((c) => {
                    return fields.find((f) => {
                        return (f.get('visible') === undefined || f.get('visible')) && f.get('name') === c;
                    });
                });
            });
        }).filter((spanField) => (spanField.get('children').size));
        if (!spanFields.size) {
            return null;
        }
        let spanDrawn = {};

        return (<tr className={this.getStyle('gridHeaderTr')}>
            {fields.filter((field) => { // cleanup fields that are not visible
                return field.get('visible', true);
            })
                .map((field, idx, array) => {
                    var fieldsInSpanList = spanFields.filter((spanField) => {
                        return spanField.get('children').filter((child) => {
                            return child === field.get('name');
                        }).size > 0;
                    });
                    if (fieldsInSpanList.size > 0) {
                        let identifier = fieldsInSpanList.getIn([0, 'children']).join();
                        let classSpanName = this.getStyle(fieldsInSpanList.getIn([0, 'shortName']).toLowerCase());
                        if (!spanDrawn[identifier]) {
                            spanDrawn[identifier] = 1;
                            let childNum = fieldsInSpanList.getIn([0, 'children']).size;
                            let title = fieldsInSpanList.getIn([0, 'title']);
                            if (title instanceof Map) {
                                title = title.toJS();
                            }

                            return <td className={(array.get(idx + 1) ? [this.getStyle('gridHeaderTrSpanColumnNotLast'), classSpanName].join(' ') : '')} key={idx} colSpan={childNum}>{title}</td>;
                        }
                    } else {
                        return <td className={(array.get(idx + 1) ? [this.getStyle('gridHeaderTrSpanColumnNotLast'), this.getStyle('gridHeaderTrSpanColumnContentless')].join(' ') : this.getStyle('gridHeaderTrSpanColumnContentless'))} key={idx}>&nbsp;</td>;
                    }
                })}
        </tr>);
    }
    render() {
        let fields = this.getFields(); // returns immutable

        return (
            <thead>
                {this.getSpanFields(fields)}
                <tr className={this.getStyle('gridHeaderTr')}>
                    {fields.map((field, idx) => {
                        if (!field.get('internal')) {
                            return <Field
                                externalStyle={this.props.externalStyle}
                                transformCellValue={this.props.transformCellValue}
                                key={idx} field={field.toJS()}
                                handleOrder={this.handleOrder}
                                orderDirection={
                                    (this.props.orderDirections && this.props.orderDirections[field.get('name')]) ||
                                  this.state.orderDirections[field.get('name')]
                                } />;
                        } else if (field.get('internal') === 'multiSelect') {
                            return <MultiSelectField
                                field={field.toJS()}
                                key={idx}
                                handleCheckboxSelect={this.props.handleHeaderCheckboxSelect}
                                isChecked={this.props.isChecked} />;
                        } else if (field.get('internal') === 'globalMenu') {
                            return <GlobalMenu
                                externalStyle={this.props.externalStyle}
                                field={field.toJS()}
                                key={idx}
                                fields={this.props.fields}
                                transformCellValue={this.props.transformCellValue}
                                toggleColumnVisibility={this.props.toggleColumnVisibility} />;
                        } else if (field.get('internal') === 'verticalSpanField') {
                            return <Field
                                field={{name: 'verticalSpanField'}}
                                externalStyle={this.props.externalStyle}
                                key={idx}
                            />;
                        } else if (field.get('internal') === 'verticalField') {
                            return <Field
                                field={{name: 'verticalField'}}
                                externalStyle={this.props.externalStyle}
                                key={idx}
                            />;
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
    verticalFields: PropTypes.bool,
    spanFields: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node.isRequired,
        children: PropTypes.arrayOf(PropTypes.node).isRequired
    })),
    verticalSpanFields: PropTypes.bool,
    verticalFieldsVisible: PropTypes.bool,
    // fields for which order is enabled e.g. ['a', 'b', 'x']
    orderBy: PropTypes.array,
    orderDirections: PropTypes.object,
    globalMenu: PropTypes.bool,
    // if true will allow order by multiple columns
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
