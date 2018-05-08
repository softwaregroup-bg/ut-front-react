import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

// Used to suppress controlled input warning
const noop = function() {};

const CheckPlus = (props) => {
    let {isDisabled, checked} = props;
    let isDisabledClass = isDisabled ? classnames(style.notAllowed, style.disabledCheckPlusBox) : style.pointer;
    let isCheckedClass = checked ? style.checked : style.unchecked;
    return (
        <span className={style.checkBoxWrapper + ' ' + style.checkPlusPointer}>
            <div className={classnames(props.className, isCheckedClass, isDisabledClass)} style={props.style} onTouchTap={isDisabled ? noop : props.onClick} />
            <label><span /></label>
            <p>{props.label}</p>
        </span>
    );
};

CheckPlus.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    checked: PropTypes.bool,
    isDisabled: PropTypes.bool
};

CheckPlus.defaultProps = {
    checked: false
};

export default CheckPlus;
