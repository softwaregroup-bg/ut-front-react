import React, { Component, PropTypes } from 'react';
import Popup from 'ut-front-react/components/Popup';
import FileDetailedView from './FileDetailedView';
import { calculateAspectRatio } from '../../../../utils/image';
import styles from './styles.css';

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
        const { file, scaleDimensions, originalFileScaleDimensions } = this.props;

        if (mode === 'details') {
            return (
                <FileDetailedView
                  file={file}
                  scaleDimensions={scaleDimensions}
                  onClick={this.onImageClick} />
            );
        }

        if (mode === 'originalFile') {
            const imageDimensions = calculateAspectRatio(file.content, originalFileScaleDimensions);

            return (
                <div className={styles.originalFilePreview}>
                    <img width={imageDimensions.width} height={imageDimensions.height} src={file.content} />
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
    closeOnEsc: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.object,
    file: PropTypes.object,
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    originalFileScaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    closePopup: PropTypes.func
};
