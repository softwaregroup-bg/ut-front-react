import React, { PropTypes } from 'react';
import classnames from 'classnames';
import StandardButton from '../StandardButton';
import styles from './styles.css';

const Footer = ({
    className,
    actionButtons
}) => {
    return (
        <div className={classnames(styles.popupFooter, className)}>
            { actionButtons &&
            actionButtons.map((button, index) => <StandardButton key={index} {...button} />)}
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
    actionButtons: PropTypes.array
};

export default Footer;
