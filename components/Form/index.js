import React, { Component, PropTypes } from 'react';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import FormErrorMessage from './FormErrorMessage';
import FormSuccessMessage from './FormSuccessMessage';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.renderInputs = this.renderInputs.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.focusNextInput = this.focusNextInput.bind(this);
    }

    componentDidMount() {
        this.focusNextInput();
    }

    renderInputs() {
        const { inputs, onChange } = this.props;
        const inputNodes = [];
        const inputsObject = inputs.toJS();
        Object.keys(inputsObject).forEach((key, index) => {
            inputNodes.push(<FormInput key={index}
                ref={inputsObject[key].name}
                className='loginInput'
                hidden={inputsObject[key].hidden}
                disabled={inputsObject[key].disabled}
                type={inputsObject[key].type}
                value={inputsObject[key].value}
                label={inputsObject[key].label}
                tabIndex={inputsObject[key].tabIndex}
                name={inputsObject[key].name}
                placeholder={inputsObject[key].placeholder}
                onChange={onChange}
                error={inputsObject[key].error}
            />);
        });

        return inputNodes;
    }

    renderButtons() {
        const { buttons } = this.props;

        return buttons.map((button, index) => <Button key={index} {...button} />);
    }

    focusNextInput() {
        const { inputs } = this.props;

        // find the first input which doesn't have value
        const nextInput = inputs.find(input => {
            return !input.get('value') && !input.get('hidden');
        });

        if (nextInput) {
            this.refs[nextInput.get('name')].refs.inputNode.focus();
        }

        return nextInput;
    }

    componentDidUpdate(prevProps) {
        // if the previous and the newly added input differ, focus the new one
        if (prevProps.inputs.last().get('name') !== this.props.inputs.last().get('name')) {
            this.focusNextInput();
        }
    }

    render() {
        const { className, title, error, onSubmit } = this.props;

        return (
            <div className={getClass(styles, className)}>
                { title ? <Title className={title.className} text={title.text} /> : false }
                { error ? (error.includes('Email sent') ? <FormSuccessMessage useNew message={error} /> : <FormErrorMessage useNew message={error} />) : false }
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
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};
