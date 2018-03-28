import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import Button from '../../components/StandardButton';
import style from './style.css';
import { getLink } from 'ut-front/react/routerHelper';
import { addTab } from '../../containers/TabMenu/actions';
import Text from '../../components/Text';

class ToolBox extends Component {
    constructor(props) {
        super(props);
        this.handleOpenTabs = this.handleOpenTabs.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }
    handleOpenTabs() {
        let {checkedHistories, objectId, objectName, objectDisplayName} = this.props;
        var chs = checkedHistories.toJS();
        for (var i = 0; i < chs.length; i++) {
            var ch = chs[i];
            let p = {
                globalId: ch.globalId,
                objectId: objectId,
                objectName: objectName
            };
            this.props.addTab(getLink('ut-history:view', p),
                <Text>{objectDisplayName + ' Version ' + ch.version}</Text>, !0, null);
        };
    }
    handleExport() {
        let {checkedHistories, objectName, objectId, objectDisplayName} = this.props;
        var chs = checkedHistories.toJS();
        chs.map(function(ch) {
            let params = Map({})
                .set('reportName', objectDisplayName + ' Version ' + ch.version)
                .set('format', 'json');
            var filterObj = {
                globalId: ch.globalId,
                objectId,
                objectName,
                eventDate: ch.auditDate,
                userName: ch.userName,
                version: ch.version
            };
            params = params.set('filters', filterObj);
            // var aElem = document.createElement('a');
            // aElem.setAttribute('target', '_blank');
            // aElem.setAttribute('href', '/rpc/history/download/' + encodeURIComponent(JSON.stringify(params.toJS())));
            // document.getElementById(objectName + '_objects_export_container').appendChild(aElem);
            // aElem.click && aElem.click();
            // aElem.remove();
            // download mutiple files by using iframe load functionality
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.setAttribute('src', '/rpc/history/download/' + encodeURIComponent(JSON.stringify(params.toJS())));
            iframe.onload = function() {
                var self = this;
                setTimeout(function() {
                    self.remove && self.remove();
                }, 50);
            };
            document.body.appendChild(iframe);
        });
    }
    render() {
        let {checkedHistories, objectId, objectName} = this.props;
        var chs = checkedHistories ? checkedHistories.toJS() : [];
        var cp = {
            currentGlobalId: null,
            prevGlobalId: null,
            objectId: objectId,
            objectName: objectName
        };
        if (chs.length === 2) {
            cp.currentGlobalId = parseInt(chs[0].version) > parseInt(chs[1].version) ? chs[0].globalId : chs[1].globalId;
            cp.prevGlobalId = parseInt(chs[0].version) < parseInt(chs[1].version) ? chs[0].globalId : chs[1].globalId;
        }
        return (
            <div className={style.actionWrap}>
                <div className={style.hidden} id={`${objectName}_objects_export_container`} />
                {
                    <div className={style.actionSeparated}>
                        <Button
                          href={getLink('ut-history:comparisonVersions', cp)}
                          className='defaultBtn'label='Compare Versions'
                          disabled={chs.length !== 2} />
                    </div>
                }
                {
                    <div className={style.actionSeparated}>
                        <Button
                          className='defaultBtn'
                          label='Open in tabs'
                          onClick={this.handleOpenTabs}
                          disabled={chs.length === 0} />
                    </div>
                }
                {this.context.checkPermission('history.history.export') &&
                    <div className={style.actionSeparated}>
                        <Button
                          className='defaultBtn'
                          label='Export'
                          onClick={this.handleExport}
                          // disabled={chs.length !== 1}
                           />
                    </div>
                }
            </div>
        );
    }
}

ToolBox.propTypes = {
    checkedHistories: PropTypes.object,
    objectId: PropTypes.string,
    objectName: PropTypes.string,
    objectDisplayName: PropTypes.string,
    addTab: PropTypes.func
};

ToolBox.contextTypes = {
    checkPermission: PropTypes.func
};

export default connect((state, props) => {
    let { objectId, objectName, objectDisplayName } = props;
    return {
        checkedHistories: state.historyContainer.getIn([objectName, objectId, 'checkedHistories']),
        objectId,
        objectName,
        objectDisplayName
    };
}, { addTab })(ToolBox);
