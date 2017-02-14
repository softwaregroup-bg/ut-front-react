import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Button from '../StandardButton';
import styles from './styles.css';

const Footer = ({
    className,
    actionButtons
}) => {
    return (
        <div className={classnames(styles.popupFooter, className)}>
            { actionButtons &&
            actionButtons.map((button, index) => <Button key={index} className={button.className} label={button.label} onClick={button.onClick} />)}
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
    actionButtons: PropTypes.array
};

export default Footer;
