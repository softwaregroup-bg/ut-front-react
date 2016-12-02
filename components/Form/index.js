import React, { PropTypes } from 'react';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import styles from './styles.css';

const Form = ({
    className,
    handleSubmit,
    title,
    inputs,
    buttons
}) => {
    return (
        <div className={styles[className]}>
            <form onSubmit={handleSubmit}>
                { title ? <Title text={title}/> : false }
                { inputs.map(input => <FormInput {...input} />) }
                { buttons.map(button => <Button {...button} />) }
            </form>
        </div>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired
}

export default Form;
