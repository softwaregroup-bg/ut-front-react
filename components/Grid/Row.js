import PropTypes from 'prop-types';
import React, { Component } from 'react';
import immutable from 'immutable';
import { Link } from 'react-router-dom';

import classnames from 'classnames';
import style from './style.css';
const noop = function() {};
class GridRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            selected: false
        };
        this.disableDeselect = false;
        this.deselect = () => this.disableDeselect || this.setState({selected: false});
        this.toggleSelect = this.toggleSelect.bind(this);
        this.toggleCheck = this.toggleCheck.bind(this);
    }

    componentWillReceiveProps({ checked, data }) {
        if (checked !== this.props.checked) {
            this.setState({checked});
        }

        if (this.props.canCheck === false && this.state.selected && this.props.data.get('actorId') !== data.get('actorId')) {
            // Case: if the data item is different but the previous one was selected - reset selected state
            this.props.subscribeUnselect(() => {});
            this.setState({selected: false});
        }
    }

    componentWillUnmount() {
        this.disableDeselect = true;
    }

    toggleSelect() {
        if (this.props.canSelect === true) {
            const isSelected = !this.state.selected;
            this.setState({selected: isSelected}, () => {
                this.props.onSelect(this.props.data, isSelected);
                isSelected && this.props.subscribeUnselect(this.deselect);
            });
        }
    }

    toggleCheck(e) {
        e.stopPropagation();
        const isChecked = !this.state.checked;
        this.setState(
            {checked: isChecked},
            () => this.props.onCheck(immutable.List([this.props.data]), isChecked)
        );
    }

    clearSelected() {
        this.setState({selected: false});
    }

    clearChecked() {
        this.setState({checked: false});
    }

    renderColumns() {
        const {columns, data, canCheck, linkableColumns, tdStyles} = this.props;
        const rowIndex = this.props.rowIndex;
        const columnElements = columns.map(({key, visible, name}, i) => {
            const transformedData = this.props.mapColumn(columns[i], data.get(key), rowIndex, data);
            const isLink = linkableColumns && linkableColumns[i];
            let currenctStyles = tdStyles[i];
            if (!currenctStyles) {
                currenctStyles = {};
            }
            if (!currenctStyles.width) {
                currenctStyles.width = 'auto';
            }

            if (isLink && visible !== false) {
                return (
                    <td key={key || i} style={currenctStyles}>
                        <Link to={data.get('url')} className={style.link} data-title={name}>
                            {transformedData || false}
                        </Link>
                    </td>
                );
            } else if (visible !== false) {
                return (
                    <td key={key || i} style={currenctStyles} data-title={name}>
                        {transformedData || false}
                    </td>
                );
            } else return null;
        });
        if (canCheck) {
            columnElements.unshift(
                <td key='checkbox' className={classnames(style.checkBox, style.tdCheckbox)} >
                    <input type='checkbox' onClick={this.toggleCheck} onChange={noop} checked={this.state.checked} />
                </td>
            );
        }
        return columnElements;
    }

    render() {
        let className = '';

        if (this.state.checked) {
            className = style.checked;
        }

        // Selected is with higher priority => selected overrides checked class
        if (this.state.selected) {
            className = style.selected;
        }

        let cursorStyle;
        if (this.props.canSelect === false) {
            cursorStyle = style.defaultCursor;
        } else {
            cursorStyle = style.pointerCursor;
        }
        return (
            <tr className={classnames(className, cursorStyle)} onClick={this.toggleSelect} style={this.props.trStyles}>
                {this.renderColumns()}
            </tr>
        );
    }
}

GridRow.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.any,
        value: PropTypes.any
    })).isRequired,
    rowIndex: PropTypes.number,
    data: PropTypes.object.isRequired, // immutable
    linkableColumns: PropTypes.array,
    trStyles: PropTypes.object,
    tdStyles: PropTypes.array,
    mapColumn: PropTypes.func,
    checked: PropTypes.bool,
    canCheck: PropTypes.bool,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    canSelect: PropTypes.bool,
    subscribeUnselect: PropTypes.func
};

GridRow.defaultProps = {
    checked: false,
    canCheck: false,
    isLink: [],
    trStyles: {},
    tdStyles: [],
    mapData: (data) => data,
    onSelect: function() {},
    canSelect: true,
    onCheck: function() {},
    subscribeUnselect: function() {},
    mapColumn: (col, value) => value
};

export default GridRow;
