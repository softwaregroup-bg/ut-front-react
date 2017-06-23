import React, { Component, PropTypes } from 'react';
import { propTypeFields, propTypeData } from '../common';
import Record from './Record.js';
import style from './styles.css';

export class Body extends Component {
    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name] || style[name];
    }
    render() {
        let body;
        let space = <span>&nbsp;</span>;
        let fields = this.props.fields.filter((f) => (!(f.visible === false)));
        let fieldsLen = fields.length + (this.props.multiSelect ? 1 : 0) + (this.props.globalMenu ? 1 : 0);
        let data = this.props.data;
        if (data.length < (this.props.verticalFields && this.props.verticalFields.length) && this.props.verticalFieldsRenderComplete) {
            data = data.concat((new Array(this.props.verticalFields.length - data.length)).fill(undefined));
        }
        if (data.length) {
            if (!this.props.rowsRenderLimit || this.props.rowsRenderLimit >= data.length) {
                let verticalField;
                let verticalSpanField;
                body = data.map((data, idx) => {
                    verticalField = this.props.verticalFields && this.props.verticalFields[idx];
                    if (verticalField) {
                        verticalSpanField = this.props.verticalSpanFields && this.props.verticalSpanFields.filter((verticalSpanField) => {
                            return verticalSpanField.children.includes(verticalField.name);
                        });
                        verticalSpanField = verticalSpanField && verticalSpanField.pop();
                    }
                    return (<Record
                      key={idx}
                      recordIndex={idx}
                      data={data}
                      verticalField={verticalField}
                      verticalSpanField={verticalSpanField}
                      verticalFieldsVisible={this.props.verticalFieldsVisible}
                      multiSelect={this.props.multiSelect}
                      globalMenu={this.props.globalMenu}
                      fields={fields}
                      externalStyle={this.props.externalStyle}
                      transformCellValue={this.props.transformCellValue}
                      handleCheckboxSelect={this.props.handleCheckboxSelect}
                      handleClick={this.props.handleRowClick}
                      rowsChecked={this.props.rowsChecked}
                      handleCellClick={this.props.handleCellClick}
                      rowStyleField={this.props.rowStyleField}
                    />);
                });
            } else {
                body = (<tr><td colSpan={fieldsLen} className={this.getStyle('noResultRow')}>{this.props.rowsRenderLimitExceedMsg || space}</td></tr>);
            }
        } else {
            body = (<tr><td colSpan={fieldsLen} className={this.getStyle('noResultRow')}>{this.props.emptyRowsMsg || space}</td></tr>);
        }
        return (
            <tbody>{body}</tbody>
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
    rowsChecked: PropTypes.array,
    handleCellClick: PropTypes.func,
    rowStyleField: PropTypes.string
};

Body.defaultProps = {
    fields: [],
    data: []
};

Body.contextTypes = {
    implementationStyle: PropTypes.object
};
