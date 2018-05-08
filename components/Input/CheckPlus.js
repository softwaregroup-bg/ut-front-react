import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

// Used to suppress controlled input warning
const noop = function() {};

const CheckPlus = (props) => {
    let {disabled, checked} = props;
    let disabledClass = disabled ? classnames(style.notAllowed, style.disabledCheckPlusBox) : style.pointer;
    let checkedClass = checked ? style.checked : style.unchecked;
    return (
        <span className={style.checkBoxWrapper + ' ' + style.checkPlusPointer}>
            <div className={classnames(props.className, checkedClass, disabledClass)} style={props.style} onTouchTap={disabled ? noop : props.onClick} />
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
    disabled: PropTypes.bool
};

CheckPlus.defaultProps = {
    checked: false
};

export default CheckPlus;
