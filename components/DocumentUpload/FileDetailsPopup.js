import React, { Component, PropTypes } from 'react';
import Popup from '../Popup';
import FileDetailedView from './FileDetailedView';
import { getFileDimensions } from '../../utils/image';
import { POPUP_MIN_OFFSETS, POPUP_HEADER_HEIGHT, POPUP_FOOTER_HEIGHT, POPUP_PADDING } from '../Popup/config';
import styles from './styles.css';

export default class FileDetailsPopup extends Component {
    constructor() {
        super();

        this.state = {
            mode: 'details'
        };

        this.calculateFileDimensions = this.calculateFileDimensions.bind(this);

        this.onImageClick = this.onImageClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen && !nextProps.isOpen) {
            this.setState({
                mode: 'details'
            });
        }
    }

    calculateFileDimensions() {
        const { file } = this.props;
        const fileDimensions = getFileDimensions(file.content);
        const { aspectRatio } = fileDimensions;
        const height = window.innerHeight - POPUP_MIN_OFFSETS - POPUP_HEADER_HEIGHT - POPUP_FOOTER_HEIGHT - 2 * POPUP_PADDING - 1;

        return {
            width: height * aspectRatio,
            height: height
        };
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
        const { file, scaleDimensions, previewType } = this.props;

        if (mode === 'details') {
            return (
                <FileDetailedView
                  file={file}
                  className={previewType}
                  scaleDimensions={scaleDimensions}
                  onClick={this.onImageClick} />
            );
        }

        if (mode === 'originalFile') {
            const dimensions = this.calculateFileDimensions();

            return (
                <div className={styles.originalFilePreview}>
                    <img width={dimensions.width} height={dimensions.height} src={file.content} />
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
              footer={{actionButtons: this.actionButtons}}>
                {this.view}
            </Popup>
        );
    }
}

FileDetailsPopup.propTypes = {
    isOpen: PropTypes.bool,
    previewType: PropTypes.string,
    closeOnEsc: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.object,
    file: PropTypes.object,
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    closePopup: PropTypes.func
};
