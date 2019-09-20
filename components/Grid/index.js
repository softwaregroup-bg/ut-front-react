import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';

import Header from './Header';
import Row from './Row';

import style from './style.css';
import cssStandard from '../../assets/index.css';

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {all: false};
        this.onAllCheck = () => this.setState(
            {all: !this.state.all},
            () => props.onCheck(this.props.rows, this.state.all)
        );

        this.onCheck = (value, isChecked) => {
            props.onCheck(value, isChecked);
            // Clear selected
            this.props.onSelect();
            this.clearSelected();
        };

        // Selection
        this.lastSelected = null;
        this.subscription = function() {};
        this.subscribeUnselect = (handler) => (this.subscription = handler);
    }

    componentWillReceiveProps(nextProps) {
        let checkedRowsCount = nextProps.checkedItems.size;
        let gridRowsCount = nextProps.rows.size;
        if (gridRowsCount === checkedRowsCount && gridRowsCount !== 0 && !this.isAllChecked()) {
            this.setState({all: true});
        } else if (gridRowsCount !== checkedRowsCount && this.isAllChecked()) {
            this.setState({all: false});
        }
    }

    handleSelect(index) {
        return (rowData, isSelected) => {
            isSelected && this.lastSelected !== null && this.lastSelected !== rowData && this.subscription();
            this.lastSelected = rowData;
            this.props.onSelect(rowData, isSelected, index);
        };
    }

    clearSelected() {
        for (var i = 0; i < this.props.rows.size; i += 1) {
            this.refs[i].clearSelected();
        }
    }

    clearChecked() {
        for (var i = 0; i < this.props.rows.size; i += 1) {
            this.refs[i].clearChecked();
        }
        this.setState({all: false});
    }

    isAllChecked() {
        return this.state.all;
    }

    render() {
        let {columns, checkedItems, rowIdentifier, sortableColumns, activeSort, linkableColumns, onRefresh, onSort, rows, canCheck, canColCustomize, onToggleColumn} = this.props;
        let rowColumns = columns;

        // Add empty column
        if (onRefresh) {
            rowColumns = columns.concat({});
        }

        let tdStyles = this.props.tdStyles;
        let trStyles = this.props.trStyles;
        let thStyles = this.props.thStyles;

        let grid = (
            <table className={style.dataGridTable}>
                {this.props.showTableHead &&
                    <Header
                        columns={columns}
                        sortable={sortableColumns}
                        onRefresh={onRefresh}
                        onCheck={this.onAllCheck}
                        canCheck={canCheck}
                        canColCustomize={canColCustomize}
                        onToggleColumn={onToggleColumn}
                        activeSort={activeSort}
                        isChecked={this.state.all}
                        onSort={onSort}
                        tdStyles={tdStyles}
                        thStyles={thStyles}
                    />
                }
                <tbody>{rows.map((rowData, i) => {
                    let checked = this.state.all || checkedItems.find((i) => rowData.get(rowIdentifier) === i.get(rowIdentifier)) !== undefined;

                    return (<Row
                        key={i}
                        rowIndex={i}
                        data={rowData}
                        checked={checked}
                        linkableColumns={linkableColumns}
                        columns={rowColumns}
                        onSelect={this.handleSelect(i)}
                        canSelect={this.props.canSelect}
                        onCheck={this.onCheck}
                        canCheck={canCheck}
                        mapColumn={this.props.mapColumn}
                        subscribeUnselect={this.subscribeUnselect}
                        ref={i}
                        tdStyles={tdStyles}
                        trStyles={trStyles}
                    />);
                })}</tbody>
            </table>
        );
        if (!this.props.cssStandard) {
            return grid;
        }

        return (
            <div className={cssStandard.tableWrap}>
                {grid}
            </div>
        );
    }
}

Grid.propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.object.isRequired, // immutable object (array)
    checkedItems: PropTypes.object, // immutable list
    rowIdentifier: PropTypes.string,

    sortableColumns: PropTypes.array,
    activeSort: PropTypes.shape({
        sortBy: PropTypes.string,
        sortOrder: PropTypes.any // oneOfType([PropTypes.string, PropTypes.string])
    }),
    linkableColumns: PropTypes.array,
    trStyles: PropTypes.object,
    tdStyles: PropTypes.array,
    thStyles: PropTypes.array,
    cssStandard: PropTypes.bool,
    canCheck: PropTypes.bool,
    showTableHead: PropTypes.bool,
    mapColumn: PropTypes.func,

    onSelect: PropTypes.func,
    canSelect: PropTypes.bool,
    canColCustomize: PropTypes.bool,
    onCheck: PropTypes.func,
    onRefresh: PropTypes.func,
    onSort: PropTypes.func,
    onToggleColumn: PropTypes.func
};

Grid.defaultProps = {
    checkedItems: immutable.List([]),
    rowIdentifier: 'actorId',
    cssStandard: false,
    canCheck: true,
    showTableHead: true,
    mapColumn: (col, colData) => colData,
    onSelect: function() {},
    onCheck: function() {},
    onLinkClick: function() {}
};

export default Grid;
