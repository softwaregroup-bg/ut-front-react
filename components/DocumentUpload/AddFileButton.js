import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

const AddFileButton = ({
    className,
    disabled,
    label,
    icon,
    onClick
}) => {
    return (
        <div className={classnames(styles.addFileBtn, className, { [styles.disabled]: disabled })} onClick={onClick}>
            { icon ? <span className={classnames(styles.addFileIcon, icon)} /> : <div className={styles.plusIcon}>
                <span className={styles.verticalLine} />
                <span className={styles.horizontalLine} />
            </div> }
            <span className={styles.addFileBtnLabel}>{ label }</span>
        </div>
    );
};

AddFileButton.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func
};

export default AddFileButton;
