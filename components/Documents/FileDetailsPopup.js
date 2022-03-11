import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { defaultImageDimensions } from './config';
import Popup from '../Popup';
import FileDetailedView from './FileDetailedView';
import FileView from './FileView';
import styles from './style.css';

export default class FileDetailsPopup extends Component {
    constructor() {
        super();
        this.state = {
            mode: 'details'
        };

        this.onImageClick = this.onImageClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen && !nextProps.isOpen) {
            this.setState({
                mode: 'details'
            });
        }
    }

    onImageClick() {
        this.setState({
            mode: 'originalFile'
        });
    }

    get actionButtons() {
        const { closePopup } = this.props;

        return [{
            name: 'ok',
            className: ['actionBtn', 'primary'],
            label: 'OK',
            onClick: closePopup
        }];
    }

    get view() {
        const { mode } = this.state;

        if (mode === 'details') {
            const filesToDisplay = this.props.file.map(file =>
                <FileDetailedView
                    file={file}
                    scaleDimensions={{ width: defaultImageDimensions.width, height: defaultImageDimensions.height }}
                    onClick={this.onImageClick}
                    key = {file.url}
                />
            );
            return (
                <>{filesToDisplay}</>
            );
        }

        if (mode === 'originalFile') {
            return (
                <div className={styles.originalFilePreview}>
                    <FileView
                        file={this.props.file[0]}
                        showOriginalFileButton
                    />
                </div>
            );
        }
    }

    render() {
        const { isOpen, closePopup, header, closeOnOverlayClick, closeOnEsc } = this.props;

        return (
            <Popup
                isOpen={isOpen}
                header={header}
                closeOnOverlayClick={closeOnOverlayClick}
                closeOnEsc={closeOnEsc}
                closePopup={closePopup}
                footer={{actionButtons: this.actionButtons}}
            >
                {this.view}
            </Popup>
        );
    }
}

const fileSchema = PropTypes.shape({
    content: PropTypes.string.isRequired,
    details: PropTypes.shape({
        type: PropTypes.string.isRequired,
        size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dateUploaded: PropTypes.string,
        description: PropTypes.string
    }).isRequired
});
FileDetailsPopup.propTypes = {
    isOpen: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.object,
    file: PropTypes.oneOfType(
        fileSchema,
        PropTypes.arrayOf(fileSchema)
    ),
    closePopup: PropTypes.func
};

FileDetailsPopup.defaultProps = {
    closeOnOverlayClick: true,
    closeOnEsc: true
};
