import React, { PropTypes, Component } from 'react';
import style from './style.css';
import Text from '../Text';

class TextField extends Component {
    constructor(props, context) {
        super(props, context);
        this.translate = this.translate.bind(this);
        // this.state = {
        //     value: props.value,
        //     valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        // };

        // this.onChangQueue = [];
        // this.initialValue = props.value;

        // this.handleChange = this.handleChange.bind(this);
        // this.notifyForChange = this.notifyForChange.bind(this);
        // this.style = props.customStyle || defaultStyle;
    }

    translate(text) {
        return typeof this.context.translate === 'function' ? this.context.translate(text) : text;
    }

    render() {
        if (this.props.label) {
            return (
                <div className={style.outerWrap}>
                    <div className={style.labelWrap}>
                        {this.props.label && <Text>{this.props.label}</Text>}
                    </div>
                    <div className={style.inputWrap}>
                        <input ref='input' className={style.input} {...this.props} {...this.props} placeholder={this.props.placeholder ? this.translate(this.props.placeholder) : this.props.placeholder} />
                    </div>
                </div>
            );
        } else {
            return <input ref='input' className={style.input} {...this.props} placeholder={this.props.placeholder ? this.translate(this.props.placeholder) : this.props.placeholder} />;
        }
    }
}

TextField.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value: PropTypes.string,
    placeholder: PropTypes.string
};

TextField.contextTypes = {
    translate: PropTypes.func
};

export default TextField;
