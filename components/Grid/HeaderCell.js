import React, { Component, PropTypes } from 'react';
import Txt from '../Txt';
import style from './style.css';
import classnames from 'classnames';

class HeaderCell extends Component {
    render() {
        let sortStyle;

        switch (this.props.sortState) {
            case 1:
                sortStyle = style.sortArrow;
                break;
            case 2:
                sortStyle = classnames(style.sortArrow, style.descArrow);
                break;
            default:
                sortStyle = '';
                break;
        }

        return (
             <th onClick={this.props.canSort ? this.props.onSort : null} style={{width: 'auto', ...this.props.styles}}>
                <Txt>{this.props.name}</Txt>
                {this.props.canSort && <span className={sortStyle} />}
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
