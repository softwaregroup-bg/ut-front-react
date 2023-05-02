/* eslint-disable react/no-unknown-property */
import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import classnames from 'classnames';
import Text from '../Text';

// Used to suppress controlled input warning
const noop = function() {};

const CheckPlus = (props) => {
    const {disabled, checked} = props;
    const disabledClass = disabled ? classnames(style.notAllowed, style.disabledCheckPlusBox) : style.pointer;
    const checkedClass = checked ? style.checked : style.unchecked;
    return (
        <span className={style.checkBoxWrapper + ' ' + style.checkPlusPointer}>
            <div className={classnames(props.className, checkedClass, disabledClass)} style={props.style} onTouchTap={disabled ? noop : props.onClick} />
            <label><span /></label>
            <p>{props.label && <Text>{props.label}</Text>}</p>
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
