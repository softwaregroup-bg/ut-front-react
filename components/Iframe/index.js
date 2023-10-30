import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';

import sbStyle from '../SearchBox/style.css';
import style from './style.css';

export class Iframe extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleError = this.handleError.bind(this);
        this.askIframeForCardNumber = this.askIframeForCardNumber.bind(this);
        this.state = { addedListenerEnter: false, updated: false };
    }

    componentDidMount() {
        window.addEventListener('message', this.handleIframeMessages);
        const updateComponent = setInterval(() => {
            this.setState({ updated: true });
            clearInterval(updateComponent);
        }, 500);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleIframeMessages);
        const input = this.getInputId();
        input?.removeEventListener('keypress', this.askIframeForCardNumberOnEnter);
        this.setState({ addedListenerEnter: false });
    }

    componentDidUpdate() {
        if (
            (
                document.getElementById(`${this.props.iframeId}`)?.contentDocument?.getElementById('cardNum') ||
                document.getElementById(`${this.props.iframeId}`)?.contentWindow.document?.getElementById('cardNum')
            ) && !this.state.addedListenerEnter
        ) {
            const input = this.getInputId();
            input.addEventListener('keypress', this.askIframeForCardNumberOnEnter);
            this.setState({ addedListenerEnter: true });
        };
    }

    handleSearch(value) {
        this.props.onSearch(value);
    }

    handleError(error) {
        this.props.onSearch(error);
    }

    getStyle(name) {
        if (this.props.useDefaultStyles) {
            return sbStyle[name];
        }
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || sbStyle[name] || style[name];
    }

    handleIframeMessages = (e) => {
        if (e.origin !== '/a/pan/panFrame') {
            // ???
        }
        if (e.data.type === 'parameterization') {
            const first = document.getElementById(this.props.iframeId);
            const ifr = first.contentWindow;
            if (this.props.placeholder) {
                const msg = {
                    type: 'placeholder',
                    value: this.props.placeholder
                };
                ifr.postMessage(msg, '*');
            }
            if (this.props.authorization) {
                const msg = {
                    type: 'authorization',
                    value: this.props.authorization
                };
                ifr.postMessage(msg, '*');
            }
        } else if (e.data.type === 'encryption') {
            if (e.source.frameElement.id === this.props.iframeId) {
                this.handleSearch(e.data.value.toString());
                this.props.closeDialog();
            }
        } else if (e.data.type === 'error') {
            this.handleError(e.data.value);
            this.props.closeDialog();
        }
    };

    askIframeForCardNumber() {
        const ifr = document.getElementById(this.props.iframeId).contentWindow;
        ifr.postMessage({ type: 'encrypt' }, '*');
    }

    askIframeForCardNumberOnEnter = (event) => {
        if (event.key === 'Enter') {
            const ifr = document.getElementById(this.props.iframeId).contentWindow;
            ifr.postMessage({ type: 'encrypt' }, '*');
        }
    };

    getIframe = () => {
        const iframe = document.getElementById(this.props.iframeId);
        const innerDoc = (iframe.contentDocument)
            ? iframe.contentDocument
            : iframe.contentWindow.document;
        return innerDoc;
    };

    getInputId = () => {
        const innerDoc = this.getIframe();
        const input = innerDoc.getElementById('cardNum');
        return input;
    };

    render() {
        const boxStyles = [this.getStyle('searchBox')];
        if (!this.props.label) {
            boxStyles.push(this.getStyle('searchBoxNoLabel'));
        }
        if (!this.props.isValid) {
            boxStyles.push(this.getStyle('error'));
        }

        return (
            <div>
                <div className={classnames(this.getStyle('searchBoxWrap'), this.getStyle('iframeSearchBox'))}>
                    {this.props.label
                        ? (
                            <span className={classnames(this.getStyle('label'), this.props.boldLabel ? this.getStyle('boldLabel') : '', style.labelColor)}>
                                {this.props.label}
                            </span>
                        )
                        : ''}
                    <div className={classnames(...boxStyles)}>
                        <div className={classnames(this.getStyle('searchBoxWrapInput'), this.props.input && this.getStyle('showAsInput'))} >
                            <iframe
                                referrerPolicy='strict-origin-when-cross-origin'
                                src='/a/pan/panFrame'
                                id={this.props.iframeId}
                            />
                        </div>
                        {!this.props.input && <button onClick={this.askIframeForCardNumber} />}
                    </div>
                </div>
                <div className={classnames(this.getStyle('errorWrap'), this.props.isValid ? this.getStyle('hh') : '')}>
                    {!this.props.isValid && <div className={this.getStyle('errorMessage')}>{this.props.errorMessage}</div>}
                </div>
            </div>
        );
    }
}

Iframe.propTypes = {
    placeholder: PropTypes.string,
    externalStyle: PropTypes.object,
    label: PropTypes.node,
    // defaultValue: PropTypes.string,
    boldLabel: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    iframeId: PropTypes.string,
    onSearch: PropTypes.func,
    closeDialog: PropTypes.func,
    authorization: PropTypes.string.isRequired,
    // clearOnSearch: PropTypes.bool,
    // onChange: PropTypes.func,
    useDefaultStyles: PropTypes.bool,
    input: PropTypes.bool
};

Iframe.defaultProps = {
    placeholder: '',
    defaultValue: '',
    iframeId: 'iframeId',
    useDefaultStyles: false,
    boldLabel: false,
    isValid: true,
    externalStyle: {},
    clearOnSearch: false,
    onSearch: function() { },
    onChange: function() { },
    input: false,
    closeDialog: function() { }
};

Iframe.contextTypes = {
    implementationStyle: PropTypes.object
};

export default Iframe;
