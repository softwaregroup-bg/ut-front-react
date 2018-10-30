import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

const Header = ({
    className,
    text,
    closeIcon,
    closePopup
}) => {
    // Additional outer div is used to fix positioning issue in Firefox. Do not remove it.
    return (
        <div className={classnames(styles.popupHeader, className)}>
            <div>
                <span className={styles.headerText}>{text}</span>
                {closeIcon && <div className={styles.closeBtn} onClick={closePopup} data-test="btnClose" />}
            </div>
        </div>
    );
};

Header.defaultProps = {
    closeIcon: true
};

Header.propTypes = {
    className: PropTypes.string,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
    closeIcon: PropTypes.bool,
    closePopup: PropTypes.func
};

export default Header;
