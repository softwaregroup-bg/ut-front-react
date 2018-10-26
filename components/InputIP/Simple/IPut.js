/**
 * iput v0.0.4 (https://github.com/lizheming/iput)
 * Licensed under MIT
 */
import React, { PropTypes, Component } from 'react';
import style from './style.css';

/**
 * Function to get cursor position
 */
function getRange(el) {
    let cuRange;
    let tbRange;
    let headRange;
    let range;
    let dupRange;
    let ret = {};
    if (el.setSelectionRange) {
        // standard
        ret.begin = el.selectionStart;
        ret.end = el.selectionEnd;
        ret.result = el.value.substring(ret.begin, ret.end);
    } else if (document.selection) {
        // ie
        if (el.tagName.toLowerCase() === 'input') {
            cuRange = document.selection.createRange();
            tbRange = el.createTextRange();
            tbRange.collapse(true);
            tbRange.select();
            headRange = document.selection.createRange();
            headRange.setEndPoint('EndToEnd', cuRange);
            ret.begin = headRange.text.length - cuRange.text.length;
            ret.end = headRange.text.length;
            ret.result = cuRange.text;
            cuRange.select();
        } else if (el.tagName.toLowerCase() === 'textarea') {
            range = document.selection.createRange();
            dupRange = range.duplicate();
            dupRange.moveToElementText(el);
            dupRange.setEndPoint('EndToEnd', range);
            ret.begin = dupRange.text.length - range.text.length;
            ret.end = dupRange.text.length;
            ret.result = range.text;
        }
    }
    el.focus();
    return ret;
}

class IPut extends Component {
/**
 * constructor
 */
    constructor() {
        super();
        this.state = {
            value: []
        };
    }
    componentWillReceiveProps(newProps) {
        if (newProps.clear) {
            this.setState({
                value: ['', '', '', '']
            });
        }
    }
    componentDidMount() {
        this.setState({
            value: Array.isArray(this.props.value) ? this.props.value : this.props.value.split('.')
        });
    }
    /**
 * Change Event
 */
    handleChange(e, i) {
        let val = parseInt(e.target.value);
        if (isNaN(e.target.value)) { return e.preventDefault(); }
        if (val !== '' && (val > 255 || val < 0)) { val = 255; }

        let value = this.state.value;
        value[i] = val;
        this.setState({value}, () => this.onPropsChange());

        if (!isNaN(val) && String(val).length === 3 && i < 3) { this[`_input-${i + 1}`].focus(); }
    }
    /**
 * Keydown Event
 */
    handleKeyDown(e, i) {
    /* 37 = ←, 39 = →, 8 = backspace, 190 & 110 = dot */
        let domId = i;
        if ((e.keyCode === 37 || e.keyCode === 8) && getRange(e.target).end === 0 && i > 0) { domId = i - 1; }
        if (e.keyCode === 39 && getRange(e.target).end === e.target.value.length && i < 3) { domId = i + 1; }
        if ((e.keyCode === 190 || e.keyCode === 110) && getRange(e.target).end > 0 && i < 3) { domId = i + 1; }
        this[`_input-${domId}`].focus();
    }
    /**
 * Paste Event
 */
    handlePaste(e, i) {
        let value = e.clipboardData.getData('text/plain').split('.').map(val => parseInt(val));
        if (value.length === 4 - i && value.every(val => !isNaN(val) && val >= 0 && val <= 255)) {
            let oldValue = this.state.value;
            value.forEach((val, j) => {
                oldValue[i + j] = val;
            });
            this.setState({value: oldValue}, () => this.onPropsChange());
            return e.preventDefault();
        }
    }
    /**
 * call change props
 */
    onPropsChange() {
        this.props.onChange(this.state.value.map(val => isNaN(val) ? '' : val).join('.'));
    }

    render() {
        let className = [
            style.ipInput,
            this.props.className,
            this.props.isError() ? style.error : '',
            this.props.readonly ? style.readonly : ''
        ].join(' ');
        let placeholders = Array.isArray(this.props.placeholder) ? this.props.placeholder : this.props.placeholder.split('.');

        return (
            <div className={className}>
                {this.state.value.map((val, i) =>
                    <div className={style.ipInputItem} key={i}>
                        <input
                            ref={(el) => (this[`_input-${i}`] = el)}
                            type='text'
                            value={isNaN(val) ? '' : val}
                            placeholder={isNaN(placeholders[i]) ? '' : placeholders[i]}
                            onChange={(e) => this.handleChange(e, i)}
                            onKeyDown={(e) => this.handleKeyDown(e, i)}
                            onPaste={(e) => this.handlePaste(e, i)}
                            readOnly={this.props.readonly}
                        />
                        {i !== 3 ? <i>.</i> : false}
                    </div>
                )}
            </div>
        );
    }
}

IPut.defaultProps = {
    className: '',
    value: '...',
    placeholder: '...',
    isError: () => false,
    readonly: false,
    clear: false,
    onChange: () => {}
};

IPut.propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    isError: PropTypes.func,
    readonly: PropTypes.bool,
    clear: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ])
};

export default IPut;
