import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import style from './style.css';
export default class SimpleAutoComplete extends Component {
    render() {
        const {label, placeholder, size, onChange, options, inputValue} = this.props;
        return (
            <div className={classnames(style.autoComplete)} style={this.props.wrapperStyles}>
                <div />
                <Autocomplete
                    className={style.autoCompletePopup}
                    multiple={this.props.multiple}
                    options={options}
                    getOptionLabel={(option) => option.value}
                    filterSelectedOptions
                    inputValue={inputValue}
                    size={size}
                    onChange={onChange}
                    renderInput={(inputProps) => (
                        <TextField
                            {...inputProps}
                            size='small'
                            variant='outlined'
                            label={label}
                            placeholder={placeholder}
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
    inputValue: '',
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
    size: PropTypes.string,
    inputValue: PropTypes.string
};
