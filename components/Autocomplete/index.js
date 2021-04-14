import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import style from './style.css';
export default class SimpleAutoComplete extends Component {
    render() {
        const {label, placeholder, size, onChange, options} = this.props;
        return (
            <div className={classnames(style.autoComplete)} style={this.props.wrapperStyles}>
                <div onClick={this.props.handleButtonClick} />
                <Autocomplete
                    className={style.autoCompletePopup}
                    multiple={this.props.multiple}
                    options={options}
                    getOptionLabel={(option) => option.value}
                    filterSelectedOptions
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
    // filter: AutoComplete.fuzzyFilter,
    maxSearchResults: 10,
    openOnFocus: true,
    label: '',
    placeholder: '',
    renderTagsProps: null,
    multiple: false,
    size: 'small',
    options: [],
    onChange: () => {},
    inputProps: {}
};

SimpleAutoComplete.propTypes = {
    open: PropTypes.bool,
    dataSource: PropTypes.array.isRequired,
    maxSearchResults: PropTypes.number,
    filter: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    fullWidth: PropTypes.bool,
    handleButtonClick: PropTypes.func,
    onChange: PropTypes.func,
    openOnFocus: PropTypes.bool,
    dataSourceConfig: PropTypes.object,
    onSelect: PropTypes.func,
    options: PropTypes.array,
    multiple: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    size: PropTypes.string,
    searchText: PropTypes.string
};
