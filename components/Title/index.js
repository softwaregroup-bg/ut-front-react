import React, { PropTypes } from 'react';
import Text from '../Text';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

const Title = ({ className, text }) => (
    <div className={getClass(styles, className)}>
        <Text>{text}</Text>
    </div>
);

Title.defaultProps = {
    className: 'title'
};

Title.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired
};

export default Title;
