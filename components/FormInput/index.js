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
      const {  onBlur, onChange, onFocus } = this.props;

        return (
            <div className={getClass(styles, className).concat(['hasValue'])}>
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={classNames({
                        'hasValue': value
                    })}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={value}
                    ref={(input) => { this.inputNode = input; }} />
                { label ?
                  <label
                      onClick={this.onLabelClick}
                      className={getClass(styles, 'label')} >
                      {label}
                  </label> :
                false }
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
