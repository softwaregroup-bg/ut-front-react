import React, { PropTypes, Component } from 'react';
import Iput from './IPut';
import style from './style.css';

class IPInput extends Component {
    render() {
        return (
            <Iput
              className={style.ipInput}
              value={this.props.value}
              onChange={this.props.onChange}
              isError={() => (!this.props.isValid)}
              placeholder={this.props.placeholder}
            />
        );
    }
}

IPInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    isValid: PropTypes.bool,
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ])
};

IPInput.defaultProps = {
    isValid: true,
    placeholder: '...'
};

export default IPInput;
