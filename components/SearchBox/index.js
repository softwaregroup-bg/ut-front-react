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
        this.setState({value: e.target.value});
    }

    getStyle(name) {
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
                {this.props.label ? (<span className={this.getStyle('label')}>{this.props.label}</span>) : ''}
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
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    onSearch: PropTypes.func,
    clearOnSearch: PropTypes.bool
};

SearchBox.defaultProps = {
    placeholder: '',
    defaultValue: '',
    isValid: true,
    externalStyle: {},
    clearOnSearch: false,
    onSearch: function() {}
};

SearchBox.contextTypes = {
    implementationStyle: PropTypes.object
};

export default SearchBox;
