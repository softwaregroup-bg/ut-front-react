import React, { PropTypes, Component } from 'react';
import {getLink} from 'ut-front/react/routerHelper';
import Page from '../../components/PageLayout/Page';
import { AddTab } from '../TabMenu';
import Text from '../../components/Text';
import style from './style.css';

export class Dashboard extends Component {
    getStyle(name) {
        return (this.props.externalStyle && this.props.externalStyle[name]) || this.context.implementationStyle[name] || style[name];
    }
    render() {
        return (
            <Page>
                <AddTab pathname={getLink('ut-impl:dashboard')} title={this.props.tabName} />
                <div className={[this.getStyle('background')]}>
                    <div className={this.getStyle('marginTop')}>
                        {this.props.children}
                        <div className={this.getStyle('dashboardText')}>
                            <Text>{this.props.pageText}</Text>
                        </div>
                        <div className={[this.getStyle('dashboardBg'), this.getStyle('dashboardImg')].join(' ')} />
                    </div>
                </div>
            </Page>
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
