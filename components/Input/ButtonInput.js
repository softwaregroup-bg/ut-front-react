import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import StandardButton from '../StandardButton';
import Text from '../Text';
import style from './style.css';

class ButtonInput extends Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    getValue() {
        return this.input.value;
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        });
        this.props.onChange && this.props.onChange(e.target.value);
    }

    render() {
        const { placeholder, readOnly, btnDisabled } = this.props;
        return (
            <div className={style.outerWrap}>
                <div className={classNames(style.inputButtonLabel, {[style.boldLabel]: this.props.boldLabel})}>
                    <Text>{this.props.label}</Text>
                </div>
                <div className={style.inputWrap}>
                    <input
                        readOnly={this.props.readOnly}
                        type={this.props.type}
                        ref={(c) => { this.input = c; }}
                        name={this.props.name}
                        className={classNames(style.input, style.buttonInput, {
                            [style.readonlyInput]: readOnly
                        })}
                        label={this.props.label}
                        value={this.state.value}
                        placeholder={placeholder}
                        onChange={this.onChange}
                    />
                    <StandardButton
                        type='password'
                        disabled={btnDisabled}
                        className='secondaryButton secondaryInputButton'
                        onClick={this.props.onClick}
                        label={this.props.btnText}
                    />
                </div>
            </div>
        );
    }
}

ButtonInput.defaultProps = {
    label: '',
    value: '',
    boldLabel: false,
    name: '',
    btnText: '',
    placeholder: '',
    type: 'text',
    readOnly: false
};

ButtonInput.propTypes = {
    label: PropTypes.string,
    boldLabel: PropTypes.bool,
    readOnly: PropTypes.bool,
    btnDisabled: PropTypes.bool,
    value: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    btnText: PropTypes.string,
    onClick: PropTypes.func,
    onChange: PropTypes.func
};

export default ButtonInput;
