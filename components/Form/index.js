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
            { title ? <Title className={title.className} text={title.text} /> : false }
            <form onSubmit={handleSubmit}>
                <div className={styles.formBody}>
                    { inputs.map((input, index) =>
                        <FormInput key={index}
                                   className="loginInput"
                                   type={input.get('type')}
                                   label={input.get('label')}
                                   placeholder={input.get('placeholder')} />
                    )}
                    { buttons.map((button, index) => <Button key={index} {...button} />) }
                </div>
            </form>
        </div>
    );
};

Form.propTypes = {
    className: PropTypes.string,
    title: PropTypes.object,
    inputs: PropTypes.object,
    buttons: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired
};

export default Form;
