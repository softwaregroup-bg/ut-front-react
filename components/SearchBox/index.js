import React, { PropTypes, Component } from 'react';
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
        this.props.onSearch(this.state.value);
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
        let boxStyles = [this.getStyle('searchBox'), 'boxSizing'];
        if (!this.props.label) {
            boxStyles.push(this.getStyle('searchBoxNoLabel'));
        }
        if (!this.props.isValid) {
            boxStyles.push(style.error);
        }
        let zeroHeightStyle = this.props.isValid ? style.hh : '';
        return (
            <div className={this.getStyle('searchBoxWrap')}>
                {this.props.label ? (<span className={classnames(this.getStyle('label'), {[style.boldLabel]: this.props.boldLabel})}>{this.props.label}</span>) : ''}
                <div className={classnames.apply(undefined, boxStyles)}>
                    <input value={this.state.value} onKeyUp={this.handleKeyUp} type='text' onChange={this.handleChange} className={this.getStyle('searchBoxWrapInput')} placeholder={this.props.placeholder} />
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
