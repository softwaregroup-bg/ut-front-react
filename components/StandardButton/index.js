import React, { PropTypes } from 'react';
import classNames from 'classnames';
import buttonStyles from './styles.css';
import { getClass } from '../../utils/helpers';

const getClassInternal = (className) => {
    return buttonStyles[className] || getClass(buttonStyles, className) || className;
};

const Button = ({
    type,
    label,
    onClick,
    className,
    disabled,
    disabledClassName
}) => {
    /* If you want to use both internal modular CSS (from the button itself) and external (in module context) use className as array.
       Pass the internal classes (from the button itself) like strings ('standardBtn') and the external ones already mapped (styles.[cssClassHere]). */
    var cssClass = Array.isArray(className) ? className.map(getClassInternal) : getClassInternal(className);
    var disabledClass = '';
    if (disabled) {
        disabledClass = Array.isArray(disabledClassName) ? disabledClassName.map(getClassInternal) : getClassInternal(disabledClassName);
    }

    return (
      <button disabled={disabled} type={type} className={classNames(cssClass, disabledClass)} onClick={onClick}>
        {label}
      </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    label: PropTypes.string,
    disabled: PropTypes.bool,
    disabledClassName: PropTypes.string,
    onClick: PropTypes.func
};

Button.defaultProps = {
    type: 'button',
    className: 'standardBtn',
    disabledClassName: buttonStyles.disabledBtn,
    onClick: () => {}
};

export default Button;
