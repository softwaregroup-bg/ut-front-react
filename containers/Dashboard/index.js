import React, { PropTypes, Component } from 'react';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import style from './style.css';
import {getLink} from 'ut-front/react/routerHelper';

export class Dashboard extends Component {
    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name] || style[name];
    }
    render() {
        return (
            <div>
                <AddTab pathname={getLink('ut-impl:dashboard')} title={this.props.tabName} />
                {this.props.children}
                <div className={[this.getStyle('dashboardBg'), this.getStyle('dashboardImg')].join(' ')} />
                <div className={this.getStyle('dashboardText')}>{this.props.pageText}</div>
            </div>
        );
    }
};

Dashboard.propTypes = {
    tabName: PropTypes.any,
    pageText: PropTypes.any,
    externalStyle: PropTypes.object,
    children: PropTypes.object
};

Dashboard.defaultProps = {
    tabName: 'tabName for dashboard not set',
    pageText: 'pageText for dashboard not set'
};

Dashboard.contextTypes = {
    implementationStyle: PropTypes.object
};
