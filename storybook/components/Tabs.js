import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
// import { Router, Route, browserHistory } from 'react-router';
import Tabs from '../../components/Tabs';
// import customCss from './../../components/TabMenu/style.css';
let actionNodeF = function(node) { action(node); };
storiesOf('Tabs', module)
    .add('Default usage', () => (
        <div>
            <Tabs tabs={customTabLinks} activeTab={2} onClick={actionNodeF} onTabClose={actionNodeF} />
        </div>
    ));

const customTabLinks = [{
    id: 1,
    title: 'Dashboard'
}, {
    id: 2,
    title: 'Business Units Management'
}, {
    id: 3,
    title: 'Role Management'
}, {
    id: 4,
    title: 'User Management'
}];
