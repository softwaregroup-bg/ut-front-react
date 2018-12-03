import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Txt extends Component {
    constructor(props) {
        super(props);

        this.saveNoTranslation = this.saveNoTranslation.bind(this);
    }

    saveNoTranslation(txt) {
        if (!window.noTranslationList) window.noTranslationList = {};
        window.noTranslationList[txt] = true;
    }

    render() {
        let { texts, children } = this.props;
        let translatedText = texts.get(children) || children;
        if (!texts.get(children)) {
            this.saveNoTranslation(children);
        }
        return (
            <span>{translatedText}</span>
        );
    }
}

Txt.contextTypes = {
    checkPermission: PropTypes.func
};

Txt.propTypes = {
    texts: PropTypes.any,
    children: PropTypes.any
};

export default connect(
    state => {
        return {
            texts: state.gate.get('texts')
        };
    },
    { }
)(Txt);
