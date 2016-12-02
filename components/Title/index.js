import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Text from '../Text';
import style from './styles.css';

const Title = ({ className, text }) => (
    <div className={style[className]}>
        <Text>{text}</Text>
    </div>
);

Title.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired
};

export default Title;
