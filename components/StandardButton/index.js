import React, { PropTypes } from 'react';
import classNames from 'classnames';
import buttonStyles from './styles.css';
import { getClass } from '../../utils/helpers';

const getClassInternal = (className) => buttonStyles[className] || getClass(buttonStyles, className) || className;

const Button = ({
    type,
    label,
    onClick,
    className
}) => {
    let cssClass = Array.isArray(className) ? className.map(getClassInternal) : getClassInternal(className);

    return (
      <button type={type} className={classNames(cssClass)} onClick={onClick}>
        {label}
      </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    label: PropTypes.string,
    onClick: PropTypes.func
};

Button.defaultProps = {
    type: 'button',
    className: 'standardBtn',
    onClick: () => {}
};

export default Button;
