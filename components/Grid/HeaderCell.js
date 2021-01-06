import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Text from '../Text';
import style from './style.css';
import classnames from 'classnames';

class HeaderCell extends Component {
    render() {
        let sortStyle;

        switch (this.props.sortState) {
            case 1:
                sortStyle = style.arrowSort;
                break;
            case 2:
                sortStyle = classnames(style.arrowSort, style.arrowDesc);
                break;
            default:
                sortStyle = '';
                break;
        }

        return (
            <th style={{width: 'auto', ...this.props.styles}}>
                <span onClick={this.props.canSort ? this.props.onSort : null} className={style.thTitle}><Text>{this.props.name}</Text> {this.props.canSort && <span className={sortStyle} />} </span>
            </th>
        );
    }
}

HeaderCell.propTypes = {
    name: PropTypes.any.isRequired,
    canSort: PropTypes.bool,
    onSort: PropTypes.func,
    sortState: PropTypes.number,
    styles: PropTypes.object
};

HeaderCell.defaultProps = {
    onSort: function() {},
    styles: {},
    canSort: false,
    sortState: 0
};

export default HeaderCell;
