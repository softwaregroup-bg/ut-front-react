import React, { Component, PropTypes } from 'react';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import FormErrorMessage from './FormErrorMessage';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.renderInputs = this.renderInputs.bind(this);

        this.renderButtons = this.renderButtons.bind(this);
    }

    renderInputs() {
        let { inputs, onChange } = this.props;
        let inputNodes = [];

        inputs.toSeq().forEach((input, index) => {
            inputNodes.push(<FormInput key={index}
              ref={input.get('name')}
              className='loginInput'
              disabled={input.get('disabled')}
              type={input.get('type')}
              value={input.get('value')}
              label={input.get('label')}
              tabIndex={input.get('tabIndex')}
              name={input.get('name')}
              placeholder={input.get('placeholder')}
              onChange={onChange} />);
        });

        return inputNodes;
    }

    renderButtons() {
        let { buttons } = this.props;

        return buttons.map((button, index) => <Button key={index} {...button} />);
    }

    render() {
        let { className, title, error, onSubmit } = this.props;

        return (
            <div className={getClass(styles, className)}>
                { title ? <Title className={title.className} text={title.text} /> : false }
                { error ? <FormErrorMessage useNew message={error} /> : false }
                <form className={styles.formContainer} onSubmit={onSubmit} autoComplete='off'>
                    <div className={styles.formBody}>
                        { this.renderInputs() }
                        { this.renderButtons() }
                    </div>
                </form>
            </div>
        );
    }
};

Form.propTypes = {
    className: PropTypes.string,
    title: PropTypes.object,
    error: PropTypes.string,
    message: PropTypes.string,
    inputs: PropTypes.object,
    buttons: PropTypes.array,
    invalidField: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};
