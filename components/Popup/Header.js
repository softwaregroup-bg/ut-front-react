import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

const Header = ({
    className,
    text,
    hasCloseBtn,
    closePopup
}) => {
    // Additional outer div is used to fix positioning issue in Firefox. Do not remove it.
    return (
        <div className={classnames(styles.popupHeader, className)}>
            <div>
                <span className={styles.headerText}>{text}</span>
                {hasCloseBtn && <div className={styles.closeBtn} onClick={closePopup} />}
            </div>
        </div>
    );
};

Header.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    closePopup: PropTypes.func
};

Header.defaultProps = {
    hasCloseBtn: true
};

export default Header;
