import React, { Component, PropTypes } from 'react';
import { propTypeFields, propTypeData } from '../common';
import Record from './Record.js';

export class Body extends Component {
    render() {
        return (
            <tbody>
                {
                    this.props.data.length
                    ? this.props.data.map((data, idx) => (<Record
                      key={idx}
                      recordIndex={idx}
                      data={data}
                      multiSelect={this.props.multiSelect}
                      fields={this.props.fields}
                      externalStyle={this.props.externalStyle}
                      transformCellValue={this.props.transformCellValue}
                      handleCheckboxSelect={this.props.handleCheckboxSelect}
                      handleClick={this.props.handleRowClick}
                      rowsChecked={this.props.rowsChecked}
                      handleCellClick={this.props.handleCellClick}
                    />))
                    : <tr><td colSpan={this.props.fields.length + (this.props.multiSelect ? 1 : 0)}>&nbsp;</td></tr>
                }
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
