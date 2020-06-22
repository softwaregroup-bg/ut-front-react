import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Checkbox from '../../../Input/Checkbox';

export default class InternalColumn extends Component {
    constructor(props) {
        super(props);
        this.handleCheckboxSelect = this.handleCheckboxSelect.bind(this);
    }
    handleCheckboxSelect(e) {
        e.stopPropagation();
        this.props.handleCheckboxSelect(this.props.isChecked, this.props.data, this.props.recordIndex);
    }
    render() {
        return (
            <td>
                <Checkbox isDisabled={false} checked={this.props.isChecked} onClick={this.handleCheckboxSelect} />
            </td>
        );
    }
}

InternalColumn.propTypes = {
    handleCheckboxSelect: PropTypes.func,
    data: PropTypes.object,
    recordIndex: PropTypes.number,
    isChecked: PropTypes.bool,
    field: PropTypes.object
};

InternalColumn.defaultProps = {
    handleCheckboxSelect: (oldValue, recordInfo, rowIndex) => { // should return new value
        return !oldValue;
    }
};
