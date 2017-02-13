import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

const Header = ({
    className,
    text,
    closePopup
}) => {
    return (
        <div className={classnames(styles.popupHeader, className)}>
            <span className={styles.headerText}>{text}</span>
            <div className={styles.closeBtn} onClick={closePopup} />
        </div>
    );
};

Header.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    closePopup: PropTypes.func
};

export default Header;
