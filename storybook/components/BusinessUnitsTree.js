import React from 'react';
import { storiesOf, action } from '@storybook/react';
import Tree from './../../components/BusinessUnitsTree';

storiesOf('BusinnesUnitsTree', module)
    .add('Default', () => (
        <Tree onSelect={action} data={unitsTree} styles={{main: {width: '175px', height: '96%'}}} />
    ));

const unitsTree = [{
    'id': '1003',
    'title': 'Microcred',
    'parents': null,
    'children': [{
        'id': '1022',
        'title': 'Senegal',
        'parents': '1003'
    }, {
        'id': '1023',
        'title': 'Cote d\'Ivoire',
        'parents': '1003'
    }, {
        'id': '1024',
        'title': 'Madagascar',
        'parents': '1003'
    }, {
        'id': '1025',
        'title': 'Mali',
        'parents': '1003'
    }, {
        'id': '1026',
        'title': 'Tunisia',
        'parents': '1003'
    }, {
        'id': '1027',
        'title': 'Nigeria',
        'parents': '1003'
    }, {
        'id': '1028',
        'title': 'China',
        'parents': '1003'
    }]
}];
