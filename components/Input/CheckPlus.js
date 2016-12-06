import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

const CheckPlus = (props) => (
    <span className={style.checkBoxWrapper + ' ' + style.checkPlusPointer}>
        {props.checked
            ? <div className={classnames(props.className, style.checked)} style={props.style} onClick={props.onClick} />
            : <div className={classnames(props.className, style.unchecked)} style={props.style} onClick={props.onClick} />}
        <label><span /></label>
        <p>{props.label}</p>
    </span>
);

CheckPlus.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    checked: PropTypes.bool
};

CheckPlus.defaultProps = {
    checked: false
};

export default CheckPlus;
