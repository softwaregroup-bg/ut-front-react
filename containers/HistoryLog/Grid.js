import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { fetchHistories, changeSortFilter, checkHistories, reset, selectHistory, getEventDetails } from './actions';
import Grid from '../../components/Grid';
import mainStyle from '../../assets/index.css';
import { getLink } from 'ut-front/react/routerHelper';
import { formatDate } from './timeZone';
import { Link } from 'react-router';
import style from './style.css';

const sortableColumns = [false, false, false, false];
const linkableColumns = [false, false, false, false];

class HistoryGrid extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleSort = this.handleSort.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.mapColumn = this.mapColumn.bind(this);
        this.fetchHistories = this.fetchHistories.bind(this);
        this.permissions = {
            canSeeAudit: context.checkPermission('externalAudit.audit.getByGlobalId')
        };
    }
    componentWillMount() {
        let { pageNumber, pageSize } = this.props.pagination;
        this.props.histories.size === 0 && this.fetchHistories(Object.assign({
            objectId: this.props.objectId,
            objectName: this.props.objectName
        }, this.props.filters.toJS(), { pageSize, pageNumber }));
    }
    componentWillReceiveProps(nextProps) {
        var refetch = nextProps.filterChanged && nextProps.filterChanged !== this.props.filterChanged;
        let { pageNumber, pageSize } = nextProps.pagination;
        if (refetch) {
            let filters = nextProps.filters || this.props.filters;
            this.fetchHistories(Object.assign({
                objectId: nextProps.objectId,
                objectName: nextProps.objectName
            }, filters.toJS(), {pageSize, pageNumber}));
        }
    }
    toggleColumn(field) {
        this.props.toggleColumn(field);
    }
    handleRefresh() {
        let { filters, objectId, objectName } = this.props;
        let { pageNumber, pageSize } = this.props.pagination;
        this.fetchHistories(Object.assign({}, filters.toJS(),
            {
                objectId,
                objectName,
                pageSize,
                pageNumber
            }));
    }
    fetchHistories(params) {
        this.props.fetchHistories(params);
    }
    handleSort(col, val) {
        let sortBy;
        let sortOrder;
        if (val !== 0) {
            sortBy = col;
            sortOrder = val === 2 ? 'DESC' : 'ASC';
        };
        this.props.changeSortFilter(sortBy, sortOrder);
    }
    handleSelect(history) {
        if (history) {
            var cao = history.toJS();
            let { selectHistory, checkedHistories } = this.props;
            var isSelected = !checkedHistories.toJS().find((ao) => {
                return ao.actorId === cao.actorId;
            });
            selectHistory(cao, isSelected);
        }
    }
    handleEventClick(globalId) {
        let { getEventDetails, togglePopup } = this.props;
        togglePopup && togglePopup();
        getEventDetails({
            globalId
        });
    }
    mapColumn(col, colData) {
        let histories = this.props.histories.toJS();
        var self = this;
        var objectId = this.props.objectId;
        var objectName = this.props.objectName;
        switch (col.key) {
            case 'auditDate':
                return formatDate(new Date(colData));
            case 'userName':
                return colData || 'Unknown';
            case 'globalId':
                return (this.permissions.canSeeAudit ? <div className={style.activeLink} onClick={(e) => {
                    self.handleEventClick(colData);
                    e.stopPropagation();
                    return !1;
                }}>{colData}</div> : colData);
            case '_version':
                var current = histories.find(function(h) {
                    return h._version === colData;
                });
                let params = {
                    globalId: current.globalId,
                    objectId,
                    objectName
                };
                return (<Link to={getLink('ut-history:view', params)} >{colData}</Link>);
            default:
                return colData;
        }
    }
    render() {
        let handleCheck = this.props.checkHistories;
        let handleSelect = this.handleSelect;
        let { histories, fields, objectId } = this.props;
        return (
            <div className={classnames(mainStyle.tableWrap, style.tableWrap)}>
                <Grid
                  ref={'historyChanges' + objectId}
                  canCheck
                  columns={fields}
                  sortableColumns={sortableColumns}
                  linkableColumns={linkableColumns}
                  onToggleColumn={this.toggleColumn}
                  onSort={this.handleSort}
                  onRefresh={this.handleRefresh}
                  onCheck={handleCheck}
                  onSelect={handleSelect}
                  checkedItems={this.props.checkedHistories}
                  rows={histories}
                  mapColumn={this.mapColumn}
                />
            </div>
        );
    }
}

HistoryGrid.propTypes = {
    histories: PropTypes.object.isRequired,
    filters: PropTypes.object,
    fetchHistories: PropTypes.func.isRequired,
    filterChanged: PropTypes.bool,
    checkedHistories: PropTypes.object,
    pagination: PropTypes.object,
    changeSortFilter: PropTypes.func,
    getEventDetails: PropTypes.func,
    togglePopup: PropTypes.func.isRequired,
    checkHistories: PropTypes.func,
    fields: PropTypes.array,
    toggleColumn: PropTypes.func,
    objectId: PropTypes.string.isRequired,
    objectName: PropTypes.string.isRequired,
    selectHistory: PropTypes.func,
    reset: PropTypes.func
};

HistoryGrid.defaultProps = {
    histories: Immutable.List([]),
    checkedHistories: Immutable.List([]),
    filters: {},
    filterChanged: false,
    pageSize: 25,
    pageNumber: 1
};

HistoryGrid.contextTypes = {
    checkPermission: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    let { objectId, objectName } = state.historyContainer.get('config').toJS();
    return {
        objectId,
        objectName,
        histories: state.historyContainer.getIn([objectName, objectId, 'histories']),
        checkedHistories: state.historyContainer.getIn([objectName, objectId, 'checkedHistories']),
        filterChanged: state.historyContainer.getIn([objectName, objectId, 'filterChanged']),
        filters: state.historyContainer.getIn([objectName, objectId, 'filters']),
        pagination: objectId ? state.historyContainer.getIn([objectName, objectId, 'pagination']).toJS() : {},
        fields: state.historyContainer.get('fields').toJS()
    };
}

export default connect(
    mapStateToProps,
    {fetchHistories, changeSortFilter, checkHistories, reset, selectHistory, getEventDetails}
)(HistoryGrid);
