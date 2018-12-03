import React, { PropTypes } from 'react';
import classnames from 'classnames';
import StandardButton from '../StandardButton';
import styles from './styles.css';

const Footer = ({
    className,
    actionButtons,
    leftNode
}) => {
    return (
        <div className={classnames(styles.popupFooter, className)}>
            { leftNode && <div className={styles.leftNode}> {leftNode} </div> }
            { actionButtons &&
            actionButtons.map((button, index) => <StandardButton key={index} {...button} />)}
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
    actionButtons: PropTypes.array,
    leftNode: PropTypes.node
};

export default Footer;
