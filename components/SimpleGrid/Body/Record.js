import React, { Component, PropTypes } from 'react';
import {fromJS, Map} from 'immutable';
import { propTypeFields } from '../common';
import Column from './Column.js';
import MultiSelectColumn from './SpecialColumns/MultiSelect';
import style from './styles.css';
import classnames from 'classnames';

export default class Record extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleIsRowChecked = this.handleIsRowChecked.bind(this);
    }
    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name] || style[name];
    }
    handleClick() {
        this.props.handleClick(this.props.data, this.props.recordIndex);
    }
    handleIsRowChecked() {
        if (!this.props.rowsChecked.length) {
            return false;
        }
        return fromJS(this.props.rowsChecked).includes(fromJS(this.props.data));
    }

    get rowClasses() {
        const { data } = this.props;
        let isChecked = this.handleIsRowChecked();
        let rowCheckedClass = (isChecked) ? this.getStyle('checked') : '';
        let customClass = (this.props.rowStyleField && this.props.data[this.props.rowStyleField]) ? this.props.data[this.props.rowStyleField] : '';

        return classnames(this.getStyle('gridBodyTr'), this.getStyle(customClass), rowCheckedClass, {
            [`${style.localRecord}`]: this.props.local,
            [style[`${data._gridStatus}LocalRecord`]]: this.props.local
        });
    }

    render() {
        let fields = fromJS(this.props.fields);
        if (this.props.multiSelect) {
            fields = fields.unshift(Map({internal: 'multiSelect'}));
        }

        let isChecked = this.handleIsRowChecked();
        let totalFields = fields.size - 1;
        return (
            <tr onTouchTap={this.handleClick} className={this.rowClasses}>
                {fields.map((field, idx) => (
                    !field.get('internal')
                    ? <Column
                      key={idx}
                      colspan={((this.props.globalMenu && totalFields === idx) ? 2 : 1)}
                      recordIndex={this.props.recordIndex}
                      transformValue={this.props.transformCellValue}
                      data={this.props.data}
                      handleClick={this.props.handleCellClick}
                      field={field.toJS()}
                    />
                    : <MultiSelectColumn
                      field={field.toJS()}
                      data={this.props.data}
                      key={idx}
                      recordIndex={this.props.recordIndex}
                      isChecked={isChecked}
                      handleCheckboxSelect={this.props.handleCheckboxSelect}
                    />
                ))}
            </tr>
        );
    }
}

Record.propTypes = {
    externalStyle: PropTypes.object,
    fields: propTypeFields,
    data: PropTypes.object.isRequired,
    handleCheckboxSelect: PropTypes.func,
    recordIndex: PropTypes.number.isRequired,
    multiSelect: PropTypes.bool,
    globalMenu: PropTypes.bool,
    transformCellValue: PropTypes.func,
    rowsChecked: PropTypes.array,
    handleCellClick: PropTypes.func,
    handleClick: PropTypes.func,
    rowStyleField: PropTypes.string,
    local: PropTypes.bool
};

Record.defaultProps = {
    fields: [],
    data: {},
    handleClick: (record) => {}
};

Record.contextTypes = {
    implementationStyle: PropTypes.object
};
