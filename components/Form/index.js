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
    onSubmit,
    onBlur,
    onChange
}) => {
  debugger;
    return (
        <div className={getClass(styles, className)}>
            { title ? <Title className={title.className} text={title.text} /> : false }
            <form onSubmit={onSubmit}>
                <div className={styles.formBody}>
                    { inputs.map((input, index) =>
                        <FormInput key={index}
                                   className="loginInput"
                                   type={input.get('type')}
                                   label={input.get('label')}
                                   name={input.get('name')}
                                   placeholder={input.get('placeholder')}
                                   onChange={onChange}
                                   onBlur={onBlur} />
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
    onSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Form;
