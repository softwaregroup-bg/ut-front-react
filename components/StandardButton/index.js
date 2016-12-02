import React, { PropTypes } from 'react';
import buttonStyles from './styles.css';
import { getClass } from '../../utils/helpers';

const Button = ({
    type,
    label,
    onClick,
    className
}) => (
    <button type={type} className={getClass(buttonStyles, className)} onClick={onClick} onTouchTap={onClick}>
        {label}
    </button>
);

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func
};

Button.defaultProps = {
    type: 'button',
    className: 'standardBtn',
    onClick: () => {}
};

export default Button;
