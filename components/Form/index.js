import React, { Component, PropTypes } from 'react';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.renderInputs = this.renderInputs.bind(this);
    }

    renderInputs() {
        let { inputs, onChange, onBlur } = this.props;
        let inputNodes = [];

        inputs.toSeq().forEach((input, index) => {
            inputNodes.push(<FormInput key={index}
              className='loginInput'
              type={input.get('type')}
              label={input.get('label')}
              name={input.get('name')}
              placeholder={input.get('placeholder')}
              onChange={onChange}
              onBlur={onBlur} />);
        });

        return inputNodes;
    }

    render() {
        let { className, title, buttons, onSubmit } = this.props;

        return (
            <div className={getClass(styles, className)}>
                { title ? <Title className={title.className} text={title.text} /> : false }
                <form className={styles.formContainer} onSubmit={onSubmit}>
                    <div className={styles.formBody}>
                        { this.renderInputs() }
                        { buttons.map((button, index) => <Button key={index} {...button} />) }
                    </div>
                </form>
            </div>
        );
    }
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
