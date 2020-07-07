import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from './style.css';

class TextField extends Component {
    render() {
        if (this.props.label) {
            return (
                <div className={style.outerWrap}>
                    <div className={style.labelWrap}>
                        {this.props.label}
                    </div>
                    <div className={style.inputWrap}>
                        <input ref='input' className={style.input} {...this.props} />
                    </div>
                </div>
            );
        } else {
            return <input ref='input' className={style.input} {...this.props} />;
        }
    }
}

TextField.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value: PropTypes.string
};

export default TextField;
