import React, { PropTypes, Component } from 'react';
import style from './style.css';

class ButtonInput extends Component {
    getValue() {
        return this.refs.input.value;
    }
    render() {
        return (
            <div className={style.outerWrap}>
                <div className={style.lableWrap}>
                    {this.props.label}
                </div>
                <div className={style.inputWrap}>
                    <input ref='input' className={style.input} {...this.props} style={{width: '80%'}} />
                    <button className={style.changeBtn}>{this.props.btnText}</button>
                </div>
            </div>
        );
    }
}

ButtonInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    btnText: PropTypes.string
};

export default ButtonInput;
