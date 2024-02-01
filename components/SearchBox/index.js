import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillReceiveProps({defaultValue}) {
        if (defaultValue !== this.state.value && !this.props.hideSearchButton) {
            this.setState({value: defaultValue || ''});
        }
    }

    handleSearch() {
        const value = this.state.value && this.state.value.trim();
        this.props.onSearch(value);
        if (this.props.clearOnSearch) {
            this.setState({value: ''});
        }
    }

    handleKeyUp(e) {
        if (e.keyCode === 13/* enter key */) {
            this.handleSearch();
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        this.props.hideSearchButton ? this.props.onSearch(e.target.value) : this.props.onChange({value: e.target.value});
    }

    getStyle(name) {
        if (this.props.useDefaultStyles) {
            return style[name];
        }
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }

    render() {
        const boxStyles = [this.getStyle('searchBox'), 'boxSizing'];
        const hideSearchButton = this.props.hideSearchButton;

        if (!this.props.label) {
            boxStyles.push(this.getStyle('searchBoxNoLabel'));
        }
        if (!this.props.isValid) {
            boxStyles.push(style.error);
        }
        const zeroHeightStyle = this.props.isValid ? style.hh : '';
        return (
            <div className={this.getStyle('searchBoxWrap')}>
                {this.props.label ? (<span className={classnames(this.getStyle('label'), {[style.boldLabel]: this.props.boldLabel})}>{this.props.label}</span>) : ''}
                <div className={classnames.apply(undefined, boxStyles)}>
                    <input value={this.state.value} onKeyUp={!hideSearchButton && this.handleKeyUp} type='text' onChange={this.handleChange} className={this.getStyle('searchBoxWrapInput')} placeholder={this.props.placeholder} disabled={this.props.disabled
                    }
                    />
                    {hideSearchButton ? '' : <button onClick={this.handleSearch} />}
                </div>
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValid && <div className={style.errorMessage}>{this.props.errorMessage}</div>}</div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    externalStyle: PropTypes.object,
    label: PropTypes.node,
    defaultValue: PropTypes.string,
    boldLabel: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    onSearch: PropTypes.func,
    clearOnSearch: PropTypes.bool,
    useDefaultStyles: PropTypes.bool,
    onChange: PropTypes.func,
    hideSearchButton: PropTypes.bool
};

SearchBox.defaultProps = {
    disabled: false,
    placeholder: '',
    defaultValue: '',
    useDefaultStyles: false,
    boldLabel: false,
    isValid: true,
    externalStyle: {},
    clearOnSearch: false,
    onSearch: function() {},
    onChange: function() {}
};

SearchBox.contextTypes = {
    implementationStyle: PropTypes.object
};

export default SearchBox;
