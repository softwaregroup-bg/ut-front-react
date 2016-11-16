import React, { Component, PropTypes } from 'react';
import HeaderCell from './HeaderCell';

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
        let { sortBy, sortOrder } = this.state;

        if (sortBy === col) {
            if (sortOrder + 1 > 2) {
                this.setState({sortBy: '', sortOrder: 0});
                this.props.onSort('', 0);
            } else {
                let newSortOrder = sortOrder + 1;
                this.setState({sortOrder: newSortOrder});
                this.props.onSort(sortBy, newSortOrder);
            }
        } else {
            this.setState({ sortBy: col, sortOrder: 1 });
            this.props.onSort(col, 1);
        }
    }

    render() {
        let { columns, sortable, onCheck, canCheck, onRefresh, isChecked, trStyles, thStyles } = this.props;
        let haveSortable = sortable.length > 0;

        let headCols = columns.map((col, index) => {
            let currentThStyle = thStyles[index];
            let handleSort = (e) => {
                e.stopPropagation();
                this.sort(col.key);
            };
            let sortState = this.state.sortBy === col.key ? this.state.sortOrder : 0;

            return (
                <HeaderCell
                  key={col.key}
                  name={col.name}
                  canSort={haveSortable && sortable[index]}
                  onSort={handleSort}
                  sortState={sortState}
                  styles={currentThStyle}
                />
            );
        });

        if (canCheck) {
            headCols.unshift(
                <th key='selectAll' className={classnames(style.checkBox, style.tdCheckbox)}>
                    <input type='checkbox' checked={isChecked} onChange={onCheck} />
                </th>
            );
        }

        if (onRefresh) {
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
};

GridHeader.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    isChecked: PropTypes.bool,
    canCheck: PropTypes.bool,
    sortable: PropTypes.array,
    activeSort: PropTypes.shape({
        sortBy: PropTypes.string,
        sortOrder: PropTypes.any // oneOfType([PropTypes.string, PropTypes.string])
    }),
    trStyles: PropTypes.object,
    thStyles: PropTypes.array,
    onSort: PropTypes.func,
    onCheck: PropTypes.func,
    onRefresh: PropTypes.func
};

GridHeader.defaultProps = {
    sortable: [],
    activeSort: {},
    trStyles: {},
    thStyles: [],
    onSort: () => {}
};

export default GridHeader;
