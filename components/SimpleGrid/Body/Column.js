import React, { Component, PropTypes } from 'react';
import { propTypeField } from '../common';

export default class Column extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(value) {
        return () => {
            this.props.handleClick(this.props.data, this.props.field, value, this.props.recordIndex);
        };
    }
    render() {
        var reMapKey = this.props.data[this.props.field.name] || '';
        var value = reMapKey;
        if (typeof (this.props.field.dataReMap) !== 'undefined') {
            value = this.props.field.dataReMap[reMapKey];
        }
        return (
            <td onTouchTap={this.handleClick(value)} style={this.props.field.style}>
                {this.props.transformValue(value, this.props.field, this.props.data)}
            </td>
        );
    }
}

Column.propTypes = {
    field: propTypeField,
    data: PropTypes.object,
    recordIndex: PropTypes.number,
    transformValue: PropTypes.func,
    handleClick: PropTypes.func
};

Column.defaultProps = {
    field: {},
    data: {},
    handleClick: (record, field, value, recordIndex) => {},
    transformValue: (value, field) => { return value; }
};

Column.contextTypes = {
    implementationStyle: PropTypes.object
};
