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
    renderTitle(title) {
        return (<span style={{
            display: 'block',
            transform: 'rotate(-90deg)',
            whiteSpace: 'nowrap',
            marginTop: '25px'
        }}>
            {title}
        </span>);
    }
    render() {
        return (
            <th className={this.getStyle('gridHeaderTrSpanColumnNotLast')} rowSpan={this.props.value.children.length}>
                {this.renderTitle(this.props.value.title)}
            </th>
        );
    }
}

VerticalHeaderColumn.propTypes = {
    value: PropTypes.object,
    recordIndex: PropTypes.number,
    field: PropTypes.object,
    verticalField: propTypeField,
    externalStyle: PropTypes.object
};

VerticalHeaderColumn.defaultProps = {
};
