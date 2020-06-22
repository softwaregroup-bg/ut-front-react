import React, { Component } from 'react';
import { storiesOf, action } from '@storybook/react';
import { Router, Route, browserHistory } from 'react-router';
import TabMenu from '../../components/TabMenu';
import customCss from './../../components/TabMenu/style.css';

storiesOf('TabMenu', module)
    .add('Tab menu with Link-s', () => (
        <div>
            <Router history={browserHistory}>
                <Route path='*' component={WrapperTabLinks} />
            </Router>
        </div>
    ))
    .add('Tab menu with div-s for clicking', () => (
        <div>
            <Router>
                <Route path='*' component={WrapperTabsClick} />
            </Router>
        </div>
    ))
    .add('Tab menu with setting custom active tab', () => (
        <div>
            <Router>
                <Route path='/' component={WrapperCustomActive} />
            </Router>
            <p style={{color: 'cornflowerblue'}}>passing pathname in tabs should match the current route and than it is active. In this case we pass empty string as path that maches '/' route </p>
        </div>
    ));

class WrapperTabsClick extends Component {
    render() {
        return (
            <div>
                <TabMenu tabs={tabsForClick} onTabClose={action} />
            </div>
        );
    }
}
class WrapperTabLinks extends Component {
    render() {
        return (
            <div>
                <TabMenu tabs={tabsLinks} onClick={action} onTabClose={action} />
            </div>
        );
    }
}
class WrapperCustomActive extends Component {
    render() {
        return (
            <div>
                <TabMenu activeTab={2} tabs={customTabLinks} onClick={action} onTabClose={action} cssStyle={customCss} />
            </div>
        );
    }
}

const tabsLinks = [{
    canClose: true,
    pathname: '/user',
    title: 'Dashboard'
}, {
    canClose: true,
    pathname: '/user/units',
    title: 'Business Units Management'
}, {
    canClose: true,
    pathname: '/user/roles',
    title: 'Role Management'
}, {
    canClose: true,
    pathname: '/user/users',
    title: 'User Management'
}, {
    canClose: true,
    pathname: '/core/items',
    title: 'Content Items & Translations'
}];

const tabsForClick = [{
    canClose: true,
    pathname: '',
    title: 'Dashboard'
}, {
    canClose: true,
    pathname: '',
    title: 'Business Units Management'
}, {
    canClose: true,
    pathname: '',
    title: 'Role Management'
}, {
    canClose: true,
    pathname: '',
    title: 'User Management'
}, {
    canClose: true,
    pathname: '',
    title: 'Content Items & Translations'
}];

const customTabLinks = [{
    id: 1,
    canClose: true,
    pathname: 'dashbord',
    title: 'Dashboard'
}, {
    id: 2,
    canClose: true,
    pathname: 'business',
    title: 'Business Units Management'
}, {
    id: 3,
    canClose: true,
    pathname: 'roles',
    title: 'Role Management'
}, {
    id: 4,
    canClose: true,
    pathname: '',
    title: 'User Management'
}, {
    id: 5,
    canClose: true,
    pathname: '',
    title: 'Content Items & Translations'
}];
