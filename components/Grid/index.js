import PropTypes from 'prop-types';
import React, { Component } from 'react';
import immutable from 'immutable';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import IrregularHeader from './IrregularHeader';
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
        const checkedRowsCount = nextProps.checkedItems.size;
        const gridRowsCount = nextProps.rows.size;
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
        for (let i = 0; i < this.props.rows.size; i += 1) {
            this[i].clearSelected();
        }
    }

    clearChecked() {
        for (let i = 0; i < this.props.rows.size; i += 1) {
            this[i].clearChecked();
        }
        this.setState({all: false});
    }

    isAllChecked() {
        return this.state.all;
    }

    render() {
        const {classes, columns, checkedItems, rowIdentifier, sortableColumns, activeSort, linkableColumns, onRefresh, onSort, rows, canCheck, canColCustomize, onToggleColumn} = this.props;
        const getRowColumns = () => {
            const rowColumns = [];
            if (this.props.hasIrregularHeader) {
                columns.map(col => {
                    if (col.type === 'multi' || col.columns) {
                        col.columns.map(lumn => {
                            rowColumns.push(lumn);
                        });
                    } else {
                        rowColumns.push(col);
                    }
                });
                return rowColumns;
            }
            return columns;
        };
        let rowColumns = getRowColumns(columns);

        // Add empty column
        if (onRefresh) {
            rowColumns = getRowColumns(columns).concat({});
        }

        const tdStyles = this.props.tdStyles;
        const trStyles = this.props.trStyles;
        const thStyles = this.props.thStyles;
        let header = '';
        if (this.props.showTableHead) {
            header = <Header
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
            />;
            if (this.props.hasIrregularHeader) {
                header = <IrregularHeader
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
                />;
            }
        }
        const grid = (
            <table className={classnames(style.dataGridTable, classes.table)}>
                {header}
                <tbody>{rows.map((rowData, i) => {
                    const checked = this.state.all || checkedItems.find((i) => rowData.get(rowIdentifier) === i.get(rowIdentifier)) !== undefined;

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
                        ref={(c) => { this[`${i}`] = c; }}
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
            <div className={classnames(cssStandard.tableWrap, this.props.externalClassName)}>
                {grid}
            </div>
        );
    }
}

Grid.propTypes = {
    classes: PropTypes.object,
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
    externalClassName: PropTypes.string,
    trStyles: PropTypes.object,
    tdStyles: PropTypes.array,
    thStyles: PropTypes.array,
    cssStandard: PropTypes.bool,
    canCheck: PropTypes.bool,
    showTableHead: PropTypes.bool,
    mapColumn: PropTypes.func,
    hasIrregularHeader: PropTypes.bool,

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
    hasIrregularHeader: false,
    canCheck: true,
    showTableHead: true,
    mapColumn: (col, colData) => colData,
    onSelect: function() {},
    onCheck: function() {},
    onLinkClick: function() {}
};

export default withStyles(({palette}) => ({
    table: {
        border: `1px solid ${palette.divider}`,
        '& tr': {
            background: palette.background.paper
        },
        '& tr:hover, & thead tr': {
            background: palette.background.default
        },
        '& tr:nth-child(2n)': {
            background: palette.background.red
        }
    }
}))(Grid);
