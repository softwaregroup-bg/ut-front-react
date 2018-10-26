import React, { Component, PropTypes } from 'react';
import { propTypeFields, propTypeData } from '../common';
import Record from './Record.js';
import style from './styles.css';

export class Body extends Component {
    constructor() {
        super();

        this.renderBody = this.renderBody.bind(this);
    }

    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name] || style[name];
    }

    renderBody(data) {
        const {
            multiSelect,
            globalMenu,
            externalStyle,
            transformCellValue,
            handleRowClick,
            handleRowDoubleClick,
            handleCheckboxSelect,
            rowsChecked,
            handleCellClick,
            rowStyleField,
            verticalFields,
            verticalFieldsRenderComplete,
            rowsRenderLimit,
            verticalSpanFields,
            verticalFieldsVisible,
            rowsRenderLimitExceedMsg
        } = this.props;

        if (data.length < (verticalFields && verticalFields.length) && verticalFieldsRenderComplete) {
            data = data.concat((new Array(verticalFields.length - data.length)).fill(undefined));
        }

        if (data.length) {
            if (!rowsRenderLimit || rowsRenderLimit >= data.length) {
                let verticalField;
                let verticalSpanField;

                return data.map((record, idx) => {
                    const { local } = record || {};

                    verticalField = verticalFields && verticalFields[idx];
                    if (verticalField) {
                        verticalSpanField = verticalSpanFields && verticalSpanFields.filter((verticalSpanField) => {
                            return verticalSpanField.children.includes(verticalField.name);
                        });
                        verticalSpanField = verticalSpanField && verticalSpanField.pop();
                    }

                    return (
                        <Record
                            key={idx}
                            local={local}
                            recordIndex={idx}
                            data={record}
                            verticalField={verticalField}
                            verticalSpanField={verticalSpanField}
                            verticalFieldsVisible={verticalFieldsVisible}
                            multiSelect={multiSelect}
                            globalMenu={globalMenu}
                            fields={this.filteredFields}
                            externalStyle={externalStyle}
                            transformCellValue={transformCellValue}
                            handleCheckboxSelect={handleCheckboxSelect}
                            handleClick={handleRowClick}
                            handleDoubleClick={handleRowDoubleClick}
                            rowsChecked={rowsChecked}
                            handleCellClick={handleCellClick}
                            rowStyleField={rowStyleField} />
                    );
                });
            }

            return (<tr><td colSpan={this.filteredFieldsLength} className={this.getStyle('noResultRow')}>{rowsRenderLimitExceedMsg}</td></tr>);
        }
    }

    get filteredFields() {
        const { fields } = this.props;

        return fields.filter((f) => (!(f.visible === false)));
    }

    get filteredFieldsLength() {
        const { multiSelect, globalMenu } = this.props;

        return this.filteredFields.length + (multiSelect ? 1 : 0) + (globalMenu ? 1 : 0);
    }

    render() {
        const { data, localData } = this.props;

        return (
            <tbody>
                { !!localData.length && this.renderBody(localData) }
                { (!!data.length && this.renderBody(data)) || <tr><td colSpan={this.filteredFieldsLength} className={this.getStyle('noResultRow')}>{this.props.emptyRowsMsg}</td></tr> }
            </tbody>
        );
    }
}

Body.propTypes = {
    fields: propTypeFields,
    verticalFields: PropTypes.array,
    externalStyle: PropTypes.object,
    multiSelect: PropTypes.bool,
    handleCheckboxSelect: PropTypes.func,
    transformCellValue: PropTypes.func,
    data: propTypeData,
    localData: PropTypes.array,
    verticalSpanFields: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node.isRequired,
        // row indexes !!!
        children: PropTypes.array.isRequired
    })),
    verticalFieldsRenderComplete: PropTypes.bool,
    verticalFieldsVisible: PropTypes.bool,
    emptyRowsMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimitExceedMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimit: PropTypes.number,
    globalMenu: PropTypes.bool,
    handleRowClick: PropTypes.func,
    handleRowDoubleClick: PropTypes.func,
    rowsChecked: PropTypes.array,
    handleCellClick: PropTypes.func,
    rowStyleField: PropTypes.string
};

Body.defaultProps = {
    fields: [],
    localData: [],
    data: [],
    rowsRenderLimitExceedMsg: ''
};

Body.contextTypes = {
    implementationStyle: PropTypes.object
};
