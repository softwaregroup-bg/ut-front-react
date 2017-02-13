import React, { PropTypes } from 'react';
import classnames from 'classnames';
import fileUploadStyles from './styles.css';

const AddFileButton = ({
    className,
    name,
    label,
    children,
    onClick
}) => {
    return (
        <div className={classnames(fileUploadStyles.addFileBtn, className)} onClick={onClick} data-type={name}>
            <span>{label}</span>
            {children}
        </div>
    );
};

AddFileButton.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.object
};

export default AddFileButton;
