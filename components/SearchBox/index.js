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
        const isTextDirectionRightToLeft = document.getElementsByTagName('html')[0].getAttribute('dir') && (document.getElementsByTagName('html')[0].getAttribute('dir').toLowerCase() === 'rtl');
        const searchBoxWrapDirection = isTextDirectionRightToLeft ? this.getStyle('searchBoxWrapRtl') : this.getStyle('searchBoxWrapLtr');
        const searchBoxWrapInputDirection = isTextDirectionRightToLeft ? this.getStyle('searchBoxWrapInputRtl') : this.getStyle('searchBoxWrapInputLtr');

        if (!this.props.label) {
            boxStyles.push(this.getStyle('searchBoxNoLabel'));
        }
        if (!this.props.isValid) {
            boxStyles.push(style.error);
        }
        const zeroHeightStyle = this.props.isValid ? style.hh : '';
        return (
            <div className={classnames(this.getStyle('searchBoxWrap'), searchBoxWrapDirection)}>
                {this.props.label ? (<span className={classnames(this.getStyle('label'), {[style.boldLabel]: this.props.boldLabel})}>{this.props.label}</span>) : ''}
                <div className={classnames.apply(undefined, boxStyles)}>
                    <input value={this.state.value} onKeyUp={this.handleKeyUp} type='text' onChange={this.handleChange} className={classnames(this.getStyle('searchBoxWrapInput'), searchBoxWrapInputDirection)} placeholder={this.props.placeholder} />
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
    implementationStyle: PropTypes.object
};

export default SearchBox;
