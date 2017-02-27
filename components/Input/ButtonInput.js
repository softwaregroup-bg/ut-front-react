import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import StandardButton from '../StandardButton';
import style from './style.css';

class ButtonInput extends Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value
        };
        this.onChange = this.onChange.bind(this);
    }
    getValue() {
        return this.refs.input.value;
    }
    onChange(e) {
        this.setState({
            value: e.target.value
        });
        this.props.onChange && this.props.onChange(e.target.value);
    }
    render() {
        const { placeholder } = this.props;
        return (
            <div className={style.outerWrap}>
                <div>
                    {this.props.label}
                </div>
                <div className={style.inputWrap}>
                    <input
                      readOnly={this.props.readOnly}
                      type={this.props.type}
                      ref='input' name={this.props.name}
                      className={classNames(style.input, style.buttonInput)}
                      label={this.props.label}
                      value={this.state.value}
                      placeholder={placeholder}
                      onChange={this.onChange} />
                    <StandardButton
                      type='password'
                      className='secondaryButton secondaryInputButton'
                      onClick={this.props.onClick}
                      label={this.props.btnText} />
                </div>
            </div>
        );
    }
}

ButtonInput.defaultProps = {
    label: '',
    value: '',
    name: '',
    btnText: '',
    placeholder: '',
    type: 'text',
    readOnly: false
};

ButtonInput.propTypes = {
    label: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    btnText: PropTypes.string,
    onClick: PropTypes.func,
    onChange: PropTypes.func
};

export default ButtonInput;
