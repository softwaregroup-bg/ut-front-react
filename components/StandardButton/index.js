import React, { PropTypes } from 'react';
import classNames from 'classnames';
import buttonStyles from './styles.css';
import { getClass } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const getClassInternal = (className) => {
    return buttonStyles[className] || getClass(buttonStyles, className) || className;
};

const Button = ({
    type,
    label,
    icon,
    onClick,
    className,
    disabled,
    disabledClassName,
    href,
    styleType
}) => {
    /* If you want to use both internal modular CSS (from the button itself) and external (in module context) use className as array.
       Pass the internal classes (from the button itself) like strings ('standardBtn') and the external ones already mapped (styles.[cssClassHere]). */
    var cssClass = Array.isArray(className) ? className.map(getClassInternal) : getClassInternal(className);
    if (styleType) {
        cssClass = classNames(cssClass, buttonStyles[styleType], buttonStyles.predefined);
    }

    if (!styleType && !className) {
        cssClass = classNames(cssClass, buttonStyles.standardBtn);
    }
    var disabledClass = '';
    if (disabled) {
        disabledClass = Array.isArray(disabledClassName) ? disabledClassName.map(getClassInternal) : getClassInternal(disabledClassName);
    }
    let button = (
        <button disabled={disabled} type={type} className={classNames(cssClass, disabledClass)} onClick={onClick}>
            {icon && <span className={icon} />}
            {label}
        </button>
    );
    if (href && !disabled) {
        return (
            <Link to={href}>
                {button}
            </Link>
        );
    }

    return button;
};

Button.propTypes = {
    type: PropTypes.string,
    styleType: PropTypes.oneOf(['primaryLight', 'primaryDark', 'secondaryLight', 'secondaryDark', 'primaryDialog', 'secondaryDialog']),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.string,
    disabled: PropTypes.bool,
    disabledClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    href: PropTypes.string,
    onClick: PropTypes.func
};

Button.defaultProps = {
    type: 'button',
    className: '',
    disabledClassName: buttonStyles.disabledBtn,
    onClick: () => {}
};

export default Button;
