import React, { Component, PropTypes } from 'react';
import {fromJS, Map} from 'immutable';
import { propTypeFields, propTypeField } from '../common';
import Column from './Column.js';
import MultiSelectColumn from './SpecialColumns/MultiSelect';
import VerticalHeaderColumn from './SpecialColumns/VerticalHeaderColumn';
import VerticalSpanColumn from './SpecialColumns/VerticalSpanColumn';
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
    render() {
        let fields = fromJS(this.props.fields);
        if (this.props.multiSelect) {
            fields = fields.unshift(Map({internal: 'multiSelect'}));
        }
        if (this.props.verticalField) {
            fields = fields.unshift(Map({internal: 'verticalField'}));
        }
        if (this.props.verticalSpanField) {
            fields = fields.unshift(Map({internal: 'verticalSpanField'}));
        }

        let isChecked = this.handleIsRowChecked();
        let rowCheckedClass = (isChecked) ? this.getStyle('checked') : '';
        let totalFields = fields.size - 1;
        let customClass = (this.props.rowStyleField && this.props.data[this.props.rowStyleField]) ? this.props.data[this.props.rowStyleField] : '';
        return (
            <tr onTouchTap={this.handleClick} className={classnames(this.getStyle('gridBodyTr'), rowCheckedClass, this.getStyle(customClass))}>
                {fields.map((field, idx) => {
                    if (!field.get('internal')) {
                        return (<Column
                          key={idx}
                          colspan={((this.props.globalMenu && totalFields === idx) ? 2 : 1)}
                          recordIndex={this.props.recordIndex}
                          transformValue={this.props.transformCellValue}
                          data={this.props.data}
                          handleClick={this.props.handleCellClick}
                          field={field.toJS()}
                        />);
                    } else {
                        switch (field.get('internal')) {
                            case 'multiSelect':
                                return (<MultiSelectColumn
                                  field={field.toJS()}
                                  data={this.props.data}
                                  key={idx}
                                  recordIndex={this.props.recordIndex}
                                  isChecked={isChecked}
                                  handleCheckboxSelect={this.props.handleCheckboxSelect}
                                />);
                            case 'verticalField':
                                // debugger;
                                return (<VerticalHeaderColumn
                                  key={idx}
                                  field={field.toJS()}
                                  value={this.props.verticalField}
                                  externalStyle={this.props.externalStyle}
                                />);
                            case 'verticalSpanField':
                                let verticalSpanField = {
                                    title: this.props.verticalSpanField.title
                                };
                                Object.assign(verticalSpanField, {children: this.props.verticalSpanField.children.sort((a, b) => (a - b))});
                                if (verticalSpanField.children[0] === this.props.verticalField.name) {
                                    return (<VerticalSpanColumn
                                      key={idx}
                                      field={field.toJS()}
                                      verticalField={this.props.verticalField}
                                      value={this.props.verticalSpanField}
                                      externalStyle={this.props.externalStyle}
                                    />);
                                }
                                return null;
                            default:
                                return null;
                        }
                    }
                })}
            </tr>
        );
    }
}

Record.propTypes = {
    externalStyle: PropTypes.object,
    fields: propTypeFields,
    data: PropTypes.object.isRequired,
    verticalSpanField: PropTypes.object,
    verticalField: propTypeField,
    handleCheckboxSelect: PropTypes.func,
    recordIndex: PropTypes.number.isRequired,
    multiSelect: PropTypes.bool,
    globalMenu: PropTypes.bool,
    transformCellValue: PropTypes.func,
    rowsChecked: PropTypes.array,
    handleCellClick: PropTypes.func,
    handleClick: PropTypes.func,
    rowStyleField: PropTypes.string
};

Record.defaultProps = {
    fields: [],
    data: {},
    handleClick: (record) => {}
};

Record.contextTypes = {
    implementationStyle: PropTypes.object
};
