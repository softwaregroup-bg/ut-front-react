import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

export default class FormInput extends Component {
    constructor(props) {
        super(props);

        this.onLabelClick = this.onLabelClick.bind(this);
    }

    onLabelClick() {
        this.inputNode.focus();
    }

    render() {
        const { type, label, name, value, placeholder, className } = this.props;
        const { onBlur, onChange, onFocus } = this.props;

        return (
            <div className={classNames(getClass(styles, className), {
                [styles.hasValue]: value
            })}>
                <input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  ref={(input) => { this.inputNode = input; }} />
                  { label ? <label onClick={this.onLabelClick} className={getClass(styles, 'label')} > {label} </label> : false }
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
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func
};
