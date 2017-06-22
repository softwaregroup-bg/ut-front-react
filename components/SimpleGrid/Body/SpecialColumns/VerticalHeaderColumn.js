import React, { Component, PropTypes } from 'react';
import { propTypeField } from '../../common';
import style from './styles.css';

export default class VerticalHeaderColumn extends Component {
    // constructor(props) {
    //     super(props);
    //     this.handleCheckboxSelect = this.handleCheckboxSelect.bind(this);
    // }
    getStyle(name) {
        return this.props.externalStyle[name] || style[name]; // this.context.implementationStyle[name] ||
    }
    render() {
        return (
            // style={this.props.field.style} className={this.props.field.className}
            <th key={this.props.value.name} className={this.getStyle('gridHeading')}>{this.props.value.title}</th>
        );
    }
}

VerticalHeaderColumn.propTypes = {
    value: propTypeField,
    recordIndex: PropTypes.number,
    field: PropTypes.object,
    externalStyle: PropTypes.object
};

VerticalHeaderColumn.defaultProps = {
};
