import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import style from './style.css';

/**
 * This is a wrapper of the react-select component
 * of JedWatson. It is wrapped so that it can be used
 * in UT as dropdown.
 */
class MultiSelectBubble extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(val) {
        const newValue = val.map((option) => ({ key: option.value, name: option.label }));
        this.props.onChange(newValue);
    }

    formatOptions(options) {
        return options.map(option => ({ value: option.key, label: option.name }));
    }

    formatValue(value) {
        return value.map(option => ({ value: option.key, label: option.name }));
    }

    render() {
        const { name, value, options, label, disabled, boldLabel } = this.props;
        return (
            <div className={style.outerWrap}>
                <div className={classnames(style.lableWrap, {[style.boldLabel]: boldLabel})}>
                    {label}
                </div>
                <div className={style.inputWrap}>
                    <Select
                        disabled={disabled}
                        name={name}
                        value={this.formatValue(value)}
                        options={this.formatOptions(options)}
                        onChange={this.handleChange}
                        multi
                    />
                </div>
            </div>
        );
    }
}

MultiSelectBubble.propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })).isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string,
    boldLabel: PropTypes.bool
};

MultiSelectBubble.defaultProps = {
    name: 'react-select-dropdown',
    errorMessage: '',
    isEdited: false,
    boldLabel: true
};

export default MultiSelectBubble;
