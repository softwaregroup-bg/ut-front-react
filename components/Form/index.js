import React, { PropTypes } from 'react';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

const Form = ({
    className,
    title,
    inputs,
    buttons,
    handleSubmit
}) => {
    return (
        <div className={getClass(styles, className)}>
            <form onSubmit={handleSubmit}>
                { title ? <Title className={title.className} text={title.text} /> : false }
                { inputs.map((input, index) => <FormInput key={index} {...input} />) }
                { buttons.map((button, index) => <Button key={index} {...button} />) }
            </form>
        </div>
    );
};

Form.propTypes = {
    className: PropTypes.string,
    title: PropTypes.object,
    inputs: PropTypes.array,
    buttons: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired
};

export default Form;
