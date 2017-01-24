import React, { PropTypes, Component } from 'react';
import Iput from './IPut';
import style from './style.css';

class IPInput extends Component {
    render() {
        return (
            <Iput
              className={style.ipInput}
              defaultValue={this.props.defaultValue}
              onChange={this.props.onChange}
              isError={() => (!this.props.isValid)}
            />
        );
    }
}

IPInput.propTypes = {
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    isValid: PropTypes.bool
};

IPInput.defaultProps = {
    isValid: true
};

export default IPInput;
