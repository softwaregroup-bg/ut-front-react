import React, { Component, PropTypes } from 'react';
import Checkbox from '../../../Input/Checkbox';
import style from './MultiSelect.css';

export default class InternalField extends Component {
    constructor(props) {
        super(props);
        this.handleCheckboxSelect = this.handleCheckboxSelect.bind(this);
    }
    handleCheckboxSelect(e) {
        e.stopPropagation();
        this.props.handleCheckboxSelect(!!this.props.isChecked);
    }
    render() {
        return (<th className={style.checkboxGridField}><Checkbox isDisabled={false} checked={this.props.isChecked} onClick={this.handleCheckboxSelect} /></th>);
    }
}

InternalField.propTypes = {
    handleCheckboxSelect: PropTypes.func,
    isChecked: PropTypes.bool
};

InternalField.defaultProps = {
    handleCheckboxSelect: (currentValue) => {}
};
