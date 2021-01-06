import PropTypes from 'prop-types';
import React from 'react';
import Text from '../Text';
import style from './style.css';
import classnames from 'classnames';

// Used to suppress controlled input warning
const noop = function() {};

const Checkbox = (props) => {
    const {isDisabled, ...propsLeft} = props;
    delete propsLeft.isDisabled; // Remove wrong html input prop (no such props from input tag)

    let label = '';
    if (props.label) {
        label = <p onClick={isDisabled ? noop : props.onClick}><Text>{props.label}</Text></p>;
    }
    const isDisabledClass = isDisabled ? classnames(style.notAllowed, style.disabledCheckbox) : style.pointer;

    return (
        <span className={classnames(style.checkBoxWrapper, isDisabledClass)}>
            <input {...propsLeft} type='checkbox' onChange={noop} className={classnames(style.checkBox, isDisabledClass)} />
            <div className={style.innerWrap}>
                <label className={style.checkBoxWrap} onClick={isDisabled ? noop : props.onClick}><span className={classnames(style.checkBoxSpanWrapper, isDisabledClass)} /></label>
                {label && <div className={style.lableWrap}>{label}</div>}
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
