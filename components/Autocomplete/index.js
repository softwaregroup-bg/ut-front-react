import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import style from './style.css';
export default class SimpleAutoComplete extends Component {
    render() {
        const {label, placeholder, size, onChange, options, selectedValue, inputValue, error, onInputChange, errorMessage, required} = this.props;
        return (
            <div className={classnames(style.autoComplete)} style={this.props.wrapperStyles}>
                <div />
                <Autocomplete
                    className={style.autoCompletePopup}
                    multiple={this.props.multiple}
                    options={options}
                    clearOnBlur={false}
                    inputValue={inputValue}
                    onInputChange={onInputChange}
                    getOptionLabel={(option) => option.value}
                    filterSelectedOptions
                    size={size}
                    onChange={onChange}
                    value={selectedValue}
                    renderInput={(inputProps) => (
                        <TextField
                            {...inputProps}
                            size='small'
                            variant='outlined'
                            label={label}
                            error={error}
                            required={required}
                            placeholder={placeholder}
                            helperText={errorMessage}
                        />
                    )}
                />
            </div>
        );
    }
}

SimpleAutoComplete.defaultProps = {
    label: '',
    placeholder: '',
    multiple: false,
    size: 'small',
    error: false,
    selectedValue: null,
    options: [],
    onChange: () => {}
};

SimpleAutoComplete.propTypes = {
    wrapperStyles: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.array,
    multiple: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    onInputChange: PropTypes.func,
    selectedValue: PropTypes.object,
    size: PropTypes.string,
    inputValue: PropTypes.string
};
