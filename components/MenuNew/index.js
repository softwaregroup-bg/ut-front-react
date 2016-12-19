import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.css';

export default class MenuNew extends Component {
    componentDidMount() {
        ReactDOM.findDOMNode(this).focus();
    }

    render() {
        const { opened, dimensions, onBlur } = this.props;
        var fields = this.props.fields || ['About', 'Help', 'Settings', 'Log out'];
        return (
              <div
                tabIndex='0'
                onBlur={onBlur}
                style={dimensions}
                className={styles.menu} >
                {fields}
              </div>
        );
    }
}

MenuNew.propTypes = {
    dimensions: PropTypes.object,
    onBlur: PropTypes.func,
    fields: PropTypes.array
};
