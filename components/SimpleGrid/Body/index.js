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
        let fieldsLen = fields.length;
        // console.log(fields);

        if (this.props.data.length) {
            if (!this.props.rowsRenderLimit || this.props.rowsRenderLimit >= this.props.data.length) {
                body = this.props.data.map((data, idx) => (
                    <Record
                      key={idx}
                      recordIndex={idx}
                      data={data}
                      multiSelect={this.props.multiSelect}
                      fields={fields}
                      externalStyle={this.props.externalStyle}
                      transformCellValue={this.props.transformCellValue}
                      handleCheckboxSelect={this.props.handleCheckboxSelect}
                      handleClick={this.props.handleRowClick}
                      rowsChecked={this.props.rowsChecked}
                      handleCellClick={this.props.handleCellClick}
                    />
                ));
            } else {
                body = (<tr><td colSpan={fieldsLen + (this.props.multiSelect ? 1 : 0)} className={this.getStyle('noResultRow')}>{this.props.rowsRenderLimitExceedMsg || space}</td></tr>);
            }
        } else {
            body = (<tr><td colSpan={fieldsLen + (this.props.multiSelect ? 1 : 0)} className={this.getStyle('noResultRow')}>{this.props.emptyRowsMsg || space}</td></tr>);
        }
        return (
            <tbody>{body}</tbody>
        );
    }
}

Body.propTypes = {
    fields: propTypeFields,
    externalStyle: PropTypes.object,
    multiSelect: PropTypes.bool,
    handleCheckboxSelect: PropTypes.func,
    transformCellValue: PropTypes.func,
    data: propTypeData,
    emptyRowsMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimitExceedMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rowsRenderLimit: PropTypes.number,
    handleRowClick: PropTypes.func,
    rowsChecked: PropTypes.array,
    handleCellClick: PropTypes.func
};

Body.defaultProps = {
    fields: [],
    data: []
};

Body.contextTypes = {
    implementationStyle: PropTypes.object
};
