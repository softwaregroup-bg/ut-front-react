import React, { PropTypes } from 'react';
import Image from '../Image';
import style from './style.css';
import plusImage from './images/addPink.png';
import checkboxImage from './images/checkedPink.png';

const CheckPlus = (props) => (
    <span className={style.checkBoxWrapper + ' ' + style.checkPlusPointer}>
        {props.checked ? <Image src={checkboxImage} className={props.className} style={props.style} onClick={props.onClick} /> : <Image src={plusImage} className={props.className} style={props.style} onClick={props.onClick} />}
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
