import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

// Used to suppress controlled input warning
const noop = function() {};

const Checkbox = (props) => {
    let {isDisabled, ...propsLeft} = props;
    delete propsLeft.isDisabled; // Remove wrong html input prop (no such props from input tag)

    let label = '';
    if (props.label) {
        label = <p>{props.label}</p>;
    }
    let isDisabledClass = isDisabled ? classnames(style.notAllowed, style.disabledCheckbox) : style.pointer;

    return (
        <span className={classnames(style.checkBoxWrapper, isDisabledClass)} onTouchTap={isDisabled ? noop : props.onClick}>
            <input {...propsLeft} type='checkbox' onChange={noop} className={classnames(style.checkBox, isDisabledClass)} />
            <div className={style.innerWrap}>
                <label className={style.checkBoxWrap}><span className={classnames(style.checkBoxSpanWrapper, isDisabledClass)} /></label>
                <div className={style.lableWrap}>{label}</div>
            </div>
        </span>
    );
};

Checkbox.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    checked: PropTypes.bool,
    isDisabled: PropTypes.bool
};

Checkbox.defaultProps = {
    isDisabled: false
};

export default Checkbox;
