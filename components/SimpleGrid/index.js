import React, { Component, PropTypes } from 'react';
import { propTypeFields, propTypeData } from './common';
import { Header } from './Header';
import { Body } from './Body';
import style from './style.css';

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
    render() {
        return (
            <table className={this.getStyle(this.props.mainClassName)}>
                {!this.props.hideHeader && <Header
                  externalStyle={this.props.externalStyle}
                  transformCellValue={this.props.transformCellValue}
                  fields={this.props.fields}
                  toggleColumnVisibility={this.props.toggleColumnVisibility}
                  orderBy={this.props.orderBy}
                  multiSelect={this.props.multiSelect}
                  handleOrder={this.props.handleOrder}
                  isChecked={this.handleIsChecked()}
                  globalMenu={this.props.globalMenu}
                  handleHeaderCheckboxSelect={this.handleHeaderCheckboxSelect}
                />}
                <Body
                  externalStyle={this.props.externalStyle}
                  fields={this.props.fields}
                  data={this.props.data}
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
                />
            </table>
        );
    }
}

SimpleGrid.propTypes = {
    fields: propTypeFields,
    data: propTypeData,
    externalStyle: PropTypes.object,
    orderBy: PropTypes.array,
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
    handleRowClick: PropTypes.func
};

SimpleGrid.defaultProps = {
    fields: [],
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
