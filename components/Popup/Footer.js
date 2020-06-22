import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import StandardButton from '../StandardButton';
import styles from './styles.css';

const Footer = ({
    className,
    actionButtons,
    leftNode,
    rightNode
}) => {
    return (
        <div className={classnames(styles.popupFooter, className)}>
            {leftNode && <div className={styles.leftNode}> {leftNode} </div>}
            {actionButtons &&
            actionButtons.map((button, index) => <StandardButton key={index} {...button} />)}
            {rightNode && <div className={styles.rightNode}> {rightNode} </div>}
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
    actionButtons: PropTypes.array,
    leftNode: PropTypes.node,
    rightNode: PropTypes.node
};

export default Footer;
