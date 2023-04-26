import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './style.css';
import Text from '../Text';

class SearchBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.translate = this.translate.bind(this);
        this.state = {
            value: this.props.defaultValue
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    translate(text) {
        return typeof this.context.translate === 'function' ? this.context.translate(text) : text;
    }

    componentWillReceiveProps({defaultValue}) {
        if (defaultValue !== this.state.value) {
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
        this.props.onChange({value: e.target.value});
        this.setState({value: e.target.value});
    }

    getStyle(name) {
        if (this.props.useDefaultStyles) {
            return style[name];
        }
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }

    render() {
        const boxStyles = [this.getStyle('searchBox'), 'boxSizing'];
        if (!this.props.label) {
            boxStyles.push(this.getStyle('searchBoxNoLabel'));
        }
        if (!this.props.isValid) {
            boxStyles.push(style.error);
        }
        const zeroHeightStyle = this.props.isValid ? style.hh : '';
        return (
            <div className={this.getStyle('searchBoxWrap')}>
                {this.props.label ? (<span className={classnames(this.getStyle('label'), {[style.boldLabel]: this.props.boldLabel})}><Text>{this.props.label}</Text></span>) : ''}
                <div className={classnames.apply(undefined, boxStyles)}>
                    <input value={this.state.value} onKeyUp={this.handleKeyUp} type='text' onChange={this.handleChange} className={this.getStyle('searchBoxWrapInput')} placeholder={this.props.placeholder ? this.translate(this.props.placeholder) : this.props.placeholder} />
                    <button onClick={this.handleSearch} />
                </div>
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValid && <div className={style.errorMessage}>{this.props.errorMessage}</div>}</div>
            </div>
        );
    }
}

SearchBox.propTypes = {
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
    onChange: PropTypes.func
};

SearchBox.defaultProps = {
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
    implementationStyle: PropTypes.object,
    translate: PropTypes.func
};

export default SearchBox;
