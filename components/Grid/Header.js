import PropTypes from 'prop-types';
import React, { Component } from 'react';
import HeaderCell from './HeaderCell';
import Menu from '../GridMenu';
import classnames from 'classnames';
import style from './style.css';

class GridHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: props.activeSort.sortBy || '',
            sortOrder: props.activeSort.sortOrder || 0
        };
        this.sort = this.sort.bind(this);
    }

    sort(col) {
        const { sortBy, sortOrder } = this.state;

        if (sortBy === col) {
            if (sortOrder + 1 > 2) {
                this.setState({sortBy: '', sortOrder: 0});
                this.props.onSort('', 0);
            } else {
                const newSortOrder = sortOrder + 1;
                this.setState({sortOrder: newSortOrder});
                this.props.onSort(sortBy, newSortOrder);
            }
        } else {
            this.setState({ sortBy: col, sortOrder: 1 });
            this.props.onSort(col, 1);
        }
    }

    render() {
        const { columns, sortable, onCheck, canCheck, onRefresh, isChecked, trStyles, thStyles, onToggleColumn, canColCustomize } = this.props;
        const haveSortable = sortable.length > 0;

        const headCols = columns.map((col, index) => {
            const currentThStyle = thStyles[index];
            const handleSort = (e) => {
                e.stopPropagation();
                this.sort(col.key);
            };
            const sortState = this.state.sortBy === col.key ? this.state.sortOrder : 0;

            return col.visible !== false ? (
                <HeaderCell
                    key={col.key}
                    name={col.name}
                    canSort={haveSortable && sortable[index]}
                    onSort={handleSort}
                    sortState={sortState}
                    styles={currentThStyle}
                />
            ) : null;
        });

        if (canCheck) {
            headCols.unshift(
                <th key='selectAll' className={classnames(style.checkBox, style.tdCheckbox)}>
                    <input type='checkbox' checked={isChecked} onChange={onCheck} />
                </th>
            );
        }

        if (canColCustomize) {
            const gmfields = columns.slice().map((f) => {
                if (!f.title) {
                    return {
                        name: f.key,
                        key: f.key,
                        title: f.name,
                        visible: f.visible
                    };
                } else return f;
            });
            headCols.push(
                <Menu key='settingsMenu' fields={gmfields} toggleColumnVisibility={onToggleColumn} onRefresh={onRefresh} />
            );
        } else if (onRefresh) {
            headCols.push(
                <th key='refreshData' onClick={onRefresh} className={style.refreshTh}>
                    <div className={style.refreshDataButton} />
                </th>
            );
        }

        return (
            <thead>
                <tr style={trStyles}>{headCols}</tr>
            </thead>
        );
    }
}

GridHeader.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        visible: PropTypes.bool
    })).isRequired,
    isChecked: PropTypes.bool,
    canCheck: PropTypes.bool,
    canColCustomize: PropTypes.bool,
    sortable: PropTypes.array,
    activeSort: PropTypes.shape({
        sortBy: PropTypes.string,
        sortOrder: PropTypes.any // oneOfType([PropTypes.string, PropTypes.string])
    }),
    trStyles: PropTypes.object,
    thStyles: PropTypes.array,
    onSort: PropTypes.func,
    onCheck: PropTypes.func,
    onRefresh: PropTypes.func,
    onToggleColumn: PropTypes.func
};

GridHeader.defaultProps = {
    sortable: [],
    activeSort: {},
    trStyles: {},
    thStyles: [],
    onSort: () => {}
};

export default GridHeader;
