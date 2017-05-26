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
        let localDataBody;
        let space = <span>&nbsp;</span>;
        let fields = this.props.fields.filter((f) => (!(f.visible === false)));
        let fieldsLen = fields.length + (this.props.multiSelect ? 1 : 0) + (this.props.globalMenu ? 1 : 0);

        if (this.props.localData.length) {
            localDataBody = this.props.localData.map((data, idx) => (
                <Record
                  local
                  key={idx}
                  recordIndex={idx}
                  data={data}
                  multiSelect={this.props.multiSelect}
                  globalMenu={this.props.globalMenu}
                  fields={fields}
                  externalStyle={this.props.externalStyle}
                  transformCellValue={this.props.transformCellValue}
                  handleCheckboxSelect={this.props.handleCheckboxSelect}
                  handleClick={this.props.handleRowClick}
                  rowsChecked={this.props.rowsChecked}
                  handleCellClick={this.props.handleCellClick}
                  rowStyleField={this.props.rowStyleField} />
            ));
        }
        if (this.props.data.length) {
            if (!this.props.rowsRenderLimit || this.props.rowsRenderLimit >= this.props.data.length) {
                body = this.props.data.map((data, idx) => (
                    <Record
                      key={idx}
                      recordIndex={idx}
                      data={data}
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
                    />
                ));
            } else {
                body = (<tr><td colSpan={fieldsLen} className={this.getStyle('noResultRow')}>{this.props.rowsRenderLimitExceedMsg || space}</td></tr>);
            }
        } else {
            body = (<tr><td colSpan={fieldsLen} className={this.getStyle('noResultRow')}>{this.props.emptyRowsMsg || space}</td></tr>);
        }
        return (
            <tbody>
              {localDataBody}
              {localDataBody && localDataBody.length && <tr className={style.dataTypeSeparator} />}
              {body}
            </tbody>
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
    localData: PropTypes.array,
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
    localData: [],
    data: []
};

Body.contextTypes = {
    implementationStyle: PropTypes.object
};
