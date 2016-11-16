import React, { Component, PropTypes } from 'react';
// import classnames from 'classnames';
import Dropdown from './../../Input/Dropdown';
import style from './style.css';
import { defaultTimeValues } from './../defaultValues';

export default class TimePicker extends Component {
    render() {
        return (
            <div className={style.ddframe}>
                <Dropdown
                  data={this.props.data}
                  defaultSelected={this.props.defaultSelected}
                  placeholder={this.props.defaultLabel}
                  disabled={this.props.disabled}
                  onSelect={this.props.onChange}
                  keyProp={this.props.keyProp}
                />
            </div>
        );
    }
}

TimePicker.defaultProps = {
    defaultLabel: 'Time',
    data: defaultTimeValues,
    disabled: false
};

TimePicker.propTypes = {
    defaultLabel: PropTypes.string,
    defaultSelected: PropTypes.any,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    keyProp: PropTypes.string,
    data: PropTypes.array
};
