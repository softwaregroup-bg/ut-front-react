import React, { PropTypes, Component } from 'react';
import { calculateAspectRatio } from '../../../../utils/image';
import { detailsMapping } from './config';
import styles from './styles.css';

export default class FileDetailedView extends Component {
    get imageDimensions() {
        const { file, scaleDimensions } = this.props;

        return calculateAspectRatio(file.content, scaleDimensions);
    }

    get details() {
        const { file } = this.props;

        return Object.keys(file.details).map((key, index) => {
            return (
                <div key={index} className={styles.detailsRow}>
                    <div className={styles.detailName}>{detailsMapping[key]}</div>
                    <div>{file.details[key]}</div>
                </div>
            );
        });
    }

    render() {
        const { file, onClick } = this.props;

        return (
            <div className={styles.fileDetailsContainer}>
                <div className={styles.filePreview} onClick={onClick}>
                    <img width={this.imageDimensions.width} height={this.imageDimensions.height} src={file.content} />
                </div>
                <div className={styles.fileDetails}>
                    {this.details}
                </div>
            </div>
        );
    }
}

FileDetailedView.propTypes = {
    file: PropTypes.string,
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    onClick: PropTypes.func
};
