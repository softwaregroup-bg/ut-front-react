import React, { PropTypes } from 'react';
import classnames from 'classnames';
import fileUploadStyles from './styles.css';

const AddFileButton = ({
    className,
    label,
    children,
    onClick
}) => {
    return (
        <div className={classnames(fileUploadStyles.addFileBtn, className)} onClick={onClick}>
            <span>{label}</span>
            {children}
        </div>
    )
};

AddFileButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.object
};

export default AddFileButton;
