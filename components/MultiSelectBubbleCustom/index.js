import React, { Component, PropTypes } from 'react';
import { Creatable } from 'react-select';
import style from './style.css';

/**
 * This is a wrapper of the react-select component
 * of JedWatson. It is wrapped so that it can be used
 * in UT as dropdown.
 */
class MultiSelectBubbleCustom extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(val) {
        let newValue = val.map((option) => ({ key: option.value, name: option.label }));
        this.props.onChange(newValue);
    }

    render() {
        let { name, value, options, label } = this.props;
        options = options.map(option => ({ value: option.key, label: option.name }));
        value = value.map(option => ({ value: option.key, label: option.name }));
        return (
            <div className={style.outerWrap}>
                <div className={style.labelWrap}>
                    {label}
                </div>
                <div className={style.inputWrap}>
                    <Creatable
                      name={name}
                      value={value}
                      options={options}
                      onChange={this.handleChange}
                      multi
                    />
                </div>
            </div>
        );
    }
}

MultiSelectBubbleCustom.propTypes = {
    name: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    })).isRequired,
    onChange: PropTypes.func,
    label: PropTypes.string
};

MultiSelectBubbleCustom.defaultProps = {
    name: 'react-select-dropdown',
    errorMessage: '',
    isEdited: false
};

export default MultiSelectBubbleCustom;
