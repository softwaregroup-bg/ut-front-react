import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.css';

export default class MenuNew extends Component {
    componentDidMount() {
        ReactDOM.findDOMNode(this).focus();
    }

    render() {
        const { width, height } = this.props.dimensions;
        var fields = ['About', 'Help', 'Settings', 'Log out'];
        return (
            <div tabIndex='0' onBlur={this.props.onBlur} style={this.props.dimensions} className={styles.menu}>
                {fields.map((field) => (<div key={field}>{field}</div>))}
            </div>
        );
    }
}

MenuNew.propTypes = {
    dimensions: PropTypes.object,
    onBlur: PropTypes.func
};
