import React, { Component, PropTypes } from 'react';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';
import Popup from 'ut-front-react/components/Popup';
import { connect } from 'react-redux';
import classnames from 'classnames';
import mainStyle from 'ut-front-react/assets/index.css';
import Grid from './Grid';
import Filters from './Filters';
import EventDetails from './EventDetails';
import Toolbox from './Toolbox';
import AdvancedPagination from 'ut-front-react/components/AdvancedPagination';
import {toggleFilter, changeHistoryProfile, updateGridPagination} from './actions';
import style from './style.css';

class HistoryLog extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isPopupOpen: false,
            popupFor: ''
        };
        this.toggleFilter = this.toggleFilter.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
    }
    componentWillMount() {
        this.props.changeHistoryProfile(this.props.objectId, this.props.objectName);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.objectId !== this.props.objectId || nextProps.objectName !== this.props.objectName) {
            this.props.changeHistoryProfile(nextProps.objectId, nextProps.objectName);
        }
    }
    toggleFilter() {
        this.props.toggleFilter();
    }
    togglePopup(popupFor) {
        this.setState({
            isPopupOpen: !this.state.isPopupOpen
        });
    }
    render() {
        let { config } = this.props;
        if (!config.objectId) return <div />; // history profile is not yet set
        let { checkedHistories, showFilter, objectId, objectName, objectDisplayName } = this.props;
        var canShowActionBar = checkedHistories.size > 0;
        var actionElem = (<Toolbox objectId={objectId} objectName={objectName} objectDisplayName={objectDisplayName} />);
        var filterElem = (<Filters />);
        return (
            <div className={style.tabMainWrap}>
                <div className={classnames(mainStyle.actionBarWrap, style.actionBarWrap)}>
                    {
                        <GridToolbox
                          title={canShowActionBar && showFilter ? 'Show Buttons' : canShowActionBar ? 'Show Filters' : 'By period'}
                          toggle={this.toggleFilter}
                          isTitleLink={canShowActionBar}
                          opened>
                            {canShowActionBar && showFilter ? filterElem : canShowActionBar ? actionElem : filterElem}
                        </GridToolbox>
                    }
                </div>
                <div className={classnames(style.gridWrap, style.tabGridWrap)} >
                    <div className={classnames(mainStyle.contentTableWrap, style.contentTableWrap)}>
                        <Grid objectId={objectId} objectName={objectName} togglePopup={this.togglePopup} />
                    </div>
                </div>
                <div className={style.pagination}>
                    <AdvancedPagination pagination={this.props.pagination} onUpdate={this.props.updateGridPagination} />
                </div>
                <Popup
                  isOpen={this.state.isPopupOpen}
                  header={{text: 'Event Details'}}
                  closePopup={this.togglePopup}
                  footer={{actionButtons: [{
                      label: 'Cancel',
                      onClick: this.togglePopup,
                      styleType: 'secondaryDialog'
                  }]}}>
                  { this.state.isPopupOpen ? <EventDetails eventDetails={this.props.eventDetails} /> : (<div />)}
                </Popup>
            </div>
        );
    }
};
HistoryLog.propTypes = {
    checkedHistories: PropTypes.object,
    showFilter: PropTypes.bool,
    toggleFilter: PropTypes.func,
    updateGridPagination: PropTypes.func,
    changeHistoryProfile: PropTypes.func,
    objectId: PropTypes.string,
    objectName: PropTypes.string,
    objectDisplayName: PropTypes.string,
    eventDetails: PropTypes.object,
    pagination: PropTypes.object,
    config: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    let { objectId, objectName } = state.historyContainer.get('config').toJS();
    return {
        objectId: ownProps.objectId,
        objectName: ownProps.objectName,
        config: state.historyContainer.get('config').toJS(),
        checkedHistories: objectId ? state.historyContainer.getIn([objectName, objectId, 'checkedHistories']) : {},
        showFilter: objectId ? state.historyContainer.getIn([objectName, objectId, 'showFilter']) : true,
        eventDetails: objectId ? state.historyContainer.getIn([objectName, objectId, 'eventDetails']).toJS() : {},
        pagination: state.historyContainer.getIn([objectName, objectId, 'pagination'])
    };
}
export default connect(mapStateToProps, {
    toggleFilter,
    changeHistoryProfile,
    updateGridPagination
})(HistoryLog);
