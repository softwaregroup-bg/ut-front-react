import React, { Component, PropTypes } from 'react';
import {fromJS, List} from 'immutable';
import { propTypeFields, propTypeData } from './common';
import { Header } from './Header';
import { Body } from './Body';
import style from './style.css';

function findField(haystack, needle) {
    return haystack.findKey((piece) => {
        return piece.get('name') === needle;
    });
}

function reorderFields(fields, spanFields) {
    if (spanFields.size > 0 && fields.size > 0) {
        let spanFieldChildren = spanFields.first().get('children');
        spanFields = spanFields.shift();
        fields = spanFieldChildren.reduce((accumulated, spanFieldChild) => {
            let fieldIdx = findField(accumulated, spanFieldChild);
            if (fieldIdx === undefined) {
                return accumulated;
            }
            let field = accumulated.get(fieldIdx);
            let before = List();
            let after = List();
            if (fieldIdx > 0) {
                before = accumulated.slice(0, fieldIdx);
            }
            if (fieldIdx < accumulated.size) {
                after = accumulated.slice(fieldIdx + 1);
            }
            accumulated = before.concat(after).push(field);
            return accumulated;
        }, fields);
        return reorderFields(fields, spanFields);
    }
    return fields;
}

function reorderVerticalFields(verticalFields, verticalSpanFields) {
    let allChildren = [];
    allChildren = verticalSpanFields.reduce((acc, verticalSpanField) => {
        return acc.concat(verticalSpanField.children);
    }, allChildren);
    verticalFields.filter((verticalField) => {
        return !allChildren.includes(verticalField.name);
    })
    .reverse()
    .forEach((freeChild) => {
        verticalSpanFields.unshift({
            title: '',
            children: [
                freeChild.name
            ]
        });
    });
    return {
        verticalFields: reorderFields(fromJS(verticalFields), fromJS(verticalSpanFields)).toJS(),
        verticalSpanFields: verticalSpanFields
    };
}

export class SimpleGrid extends Component {
    constructor(props) {
        super(props);
        this.handleHeaderCheckboxSelect = this.handleHeaderCheckboxSelect.bind(this);
        this.handleIsChecked = this.handleIsChecked.bind(this);
    }
    // execution of child registered function, the result will be passed to the handler consumed outside
    handleHeaderCheckboxSelect(currentVal) {
        this.props.handleHeaderCheckboxSelect(currentVal);
    }
    getStyle(name) {
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }
    handleIsChecked() {
        let rcl = (this.props.rowsChecked || []).length;
        let dl = (this.props.data || []).length;
        return rcl > 0 && rcl === dl;
    }
    getRawFields() {
        let fields = fromJS(this.props.fields).map((v) => { // populate visible prop
            if (v.get('visible') === undefined) {
                return v.set('visible', true);
            }
            return v;
        });
        if (this.props.spanFields.length) {
            fields = reorderFields(fields, fromJS(this.props.spanFields));
        }
        return fields;
    }
    inSpanStyleFix(fields, newSpanFields) {
        var fieldsInSpan = newSpanFields.reduce((a1, c1) => {
            return c1.children.reduce((a2, c2) => {
                a2[c2] = c1.shortName;
                return a2;
            }, a1);
        }, {});
        return fields.map((e) => {
            return e.update((v) => {
                if (fieldsInSpan[e.get('name')]) {
                    return v.set('inSpanStyle', fieldsInSpan[e.get('name')]);
                }
                return v;
            });
        });
    }
    render() {
        var newSpanFields = this.props.spanFields.map((c) => {
            let shortName = c.children.join('-').toLowerCase();
            return {shortName: shortName, title: c.title, children: c.children};
        });
        var iFields = this.inSpanStyleFix(this.getRawFields(), newSpanFields);
        var fields = iFields.toJS();
        let {verticalFields, verticalSpanFields} = reorderVerticalFields(this.props.verticalFields, this.props.verticalSpanFields);
        return (
            <table className={this.getStyle(this.props.mainClassName)}>
                {!this.props.hideHeader && <Header
                  externalStyle={this.props.externalStyle}
                  transformCellValue={this.props.transformCellValue}
                  spanFields={newSpanFields}
                  fields={fields}
                  toggleColumnVisibility={this.props.toggleColumnVisibility}
                  orderBy={this.props.orderBy}
                  orderDirections={this.props.orderDirections}
                  multiSelect={this.props.multiSelect}
                  handleOrder={this.props.handleOrder}
                  isChecked={this.handleIsChecked()}
                  globalMenu={this.props.globalMenu}
                  handleHeaderCheckboxSelect={this.handleHeaderCheckboxSelect}
                  verticalFields={verticalFields && verticalFields.length > 0}
                  verticalSpanFields={verticalSpanFields && verticalSpanFields.length > 0}
                  verticalFieldsVisible={this.props.verticalFieldsVisible}
                />}
                <Body
                  externalStyle={this.props.externalStyle}
                  fields={fields}
                  data={this.props.data}
                  localData={this.props.localData}
                  emptyRowsMsg={this.props.emptyRowsMsg}
                  rowsRenderLimit={this.props.rowsRenderLimit}
                  rowsRenderLimitExceedMsg={this.props.rowsRenderLimitExceedMsg}
                  multiSelect={this.props.multiSelect}
                  globalMenu={this.props.globalMenu}
                  transformCellValue={this.props.transformCellValue}
                  handleCheckboxSelect={this.props.handleCheckboxSelect}
                  handleCellClick={this.props.handleCellClick}
                  handleRowClick={this.props.handleRowClick}
                  rowsChecked={this.props.rowsChecked}
                  rowStyleField={this.props.rowStyleField}
                  verticalFields={verticalFields}
                  verticalSpanFields={verticalSpanFields}
                  verticalFieldsRenderComplete={this.props.verticalFieldsRenderComplete}
                  verticalFieldsVisible={this.props.verticalFieldsVisible}
                />
            </table>
        );
    }
}

SimpleGrid.propTypes = {
    fields: propTypeFields,
    verticalFields: PropTypes.array,
    spanFields: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node.isRequired,
        children: PropTypes.arrayOf(PropTypes.node).isRequired
    })),
    verticalSpanFields: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node.isRequired,
        // row indexes !!!
        children: PropTypes.array.isRequired
    })),
    verticalFieldsRenderComplete: PropTypes.bool,
    verticalFieldsVisible: PropTypes.bool,
    data: propTypeData,
    localData: PropTypes.array,
    externalStyle: PropTypes.object,
    orderBy: PropTypes.array,
    orderDirections: PropTypes.object,
    multiSelect: PropTypes.bool,
    hideHeader: PropTypes.bool,
    handleOrder: PropTypes.func,
    rowsChecked: PropTypes.array,
    globalMenu: PropTypes.bool,
    transformCellValue: PropTypes.func,
    toggleColumnVisibility: PropTypes.func,
    mainClassName: PropTypes.string,
    emptyRowsMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimitExceedMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimit: PropTypes.number,
    handleCheckboxSelect: PropTypes.func,
    handleHeaderCheckboxSelect: PropTypes.func,
    selectable: PropTypes.shape({
        checkbox: PropTypes.bool
    }),
    handleCellClick: PropTypes.func,
    handleRowClick: PropTypes.func,
    rowStyleField: PropTypes.string
};

SimpleGrid.defaultProps = {
    fields: [],
    localData: [],
    verticalFields: [],
    spanFields: [],
    verticalSpanFields: [],
    verticalFieldsRenderComplete: false,
    verticalFieldsVisible: false,
    data: [],
    rowsChecked: [],
    orderBy: [],
    externalStyle: {},
    handleOrder: () => ({}),
    handleHeaderCheckboxSelect: () => ({}),
    mainClassName: 'dataGridTable',
    selectable: {
        checkbox: false
    }
};

SimpleGrid.contextTypes = {
    implementationStyle: PropTypes.object
};
