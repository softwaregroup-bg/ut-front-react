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
        label = <p onTouchTap={isDisabled ? noop : props.onClick}>{props.label}</p>;
    }
    let isDisabledClass = isDisabled ? classnames(style.notAllowed, style.disabledCheckbox) : style.pointer;
    let classStyles = classnames(style.checkBoxWrapper, isDisabledClass);
    if (propsLeft.styleType === 'inherit') {
        classStyles = classnames(classStyles, style.checkBoxWrapperInherit);
    }

    return (
        <span className={classStyles} >
            <input {...propsLeft} type='checkbox' onChange={noop} className={classnames(style.checkBox, isDisabledClass)} />
            <div className={style.innerWrap}>
                <label className={style.checkBoxWrap} onTouchTap={isDisabled ? noop : props.onClick}><span className={classnames(style.checkBoxSpanWrapper, isDisabledClass)} /></label>
                {label && <div className={style.lableWrap} >{label}</div>}
            </div>
        </span>
    );
};

Checkbox.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    checked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    styleType: PropTypes.oneOf(['primary', 'inherit'])
};

Checkbox.defaultProps = {
    isDisabled: false,
    styleType: 'primary'
};

export default Checkbox;
