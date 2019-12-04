import React, { PropTypes, Component } from 'react';
import styles from './styles.css';
import { getClass } from '../../utils/helpers.js';

export default class FormInput extends Component {
    constructor(props) {
        super(props);

        this.onLabelClick = this.onLabelClick.bind(this);
    }

    onLabelClick() {
        this.refs.inputNode.focus();
    }

    render() {
        let { type, label, name, value, placeholder, disabled, className, error, tabIndex, hidden, acceptType } = this.props;
        let { onBlur, onChange } = this.props;
        let inputClassName = className + (disabled ? ' disabled' : '') + (value ? ' hasValue' : '') + (error ? ' hasError' : '') + (hidden ? ' hidden' : '');

        return (
            <div className={getClass(styles, inputClassName)}>
                <input
                    disabled={disabled}
                    name={name}
                    type={type}
                    data-hidden={!!hidden}
                    placeholder={placeholder}
                    accept={acceptType}
                    onChange={onChange}
                    onBlur={onBlur}
                    tabIndex={tabIndex}
                    ref='inputNode' />
                {label ? <label onClick={this.onLabelClick} className={getClass(styles, 'label')} > {label} </label> : false}
                {error ? <div className={styles.errorMessage}>{error}</div> : false}
            </div>
        );
    }
}

FormInput.defaultProps = {
    className: 'formInput'
};

FormInput.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.string,
    acceptType: PropTypes.string,
    tabIndex: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func
};
