import React from 'react';
import { storiesOf, action } from '@storybook/react';
import BusinessUnits from '../../components/BusinessUnits';
import MaterialUILayout from '../../components/MaterialUILayout';
const noop = function() {};

storiesOf('BusinessUnits', module)
    .add('Default', () => (
        <div>
            <MaterialUILayout>
                <BusinessUnits units={units} unitsTree={unitsTree} rootId='1003' selected='1003' isLoading={false} fetchBusinessUnits={noop} selectBusinessUnit={action} styles={{main: {width: '175px', height: '96%'}}} />
            </MaterialUILayout>
        </div>
    ))
    .add('loading', () => (
        <div>
            <MaterialUILayout>
                <BusinessUnits units={[]} unitsTree={[]} rootId='1003' selected='1003' isLoading fetchBusinessUnits={noop} selectBusinessUnit={action} styles={{main: {width: '175px', height: '96%'}}} />
            </MaterialUILayout>
        </div>
    ));

const unitsTree = [{
    id: '1003',
    title: 'Microcred',
    parents: null,
    children: [{
        id: '1022',
        title: 'Senegal',
        parents: '1003'
    }, {
        id: '1023',
        title: 'Cote d\'Ivoire',
        parents: '1003'
    }, {
        id: '1024',
        title: 'Madagascar',
        parents: '1003'
    }, {
        id: '1025',
        title: 'Mali',
        parents: '1003'
    }, {
        id: '1026',
        title: 'Tunisia',
        parents: '1003'
    }, {
        id: '1027',
        title: 'Nigeria',
        parents: '1003'
    }, {
        id: '1028',
        title: 'China',
        parents: '1003'
    }]
}];

const units = [{
    id: '1003',
    title: 'Microcred',
    parents: null,
    children: [{
        id: '1022',
        title: 'Senegal',
        parents: '1003'
    },
    {
        id: '1023',
        title: 'Cote d\'Ivoire',
        parents: '1003'
    },
    {
        id: '1024',
        title: 'Madagascar',
        parents: '1003'
    },
    {
        id: '1025',
        title: 'Mali',
        parents: '1003'
    },
    {
        id: '1026',
        title: 'Tunisia',
        parents: '1003'
    },
    {
        id: '1027',
        title: 'Nigeria',
        parents: '1003'
    },
    {
        id: '1028',
        title: 'China',
        parents: '1003'
    }]
},
{
    id: '1022',
    title: 'Senegal',
    parents: '1003'
},
{
    id: '1023',
    title: 'Cote d\'Ivoire',
    parents: '1003'
},
{
    id: '1024',
    title: 'Madagascar',
    parents: '1003'
},
{
    id: '1025',
    title: 'Mali',
    parents: '1003'
},
{
    id: '1026',
    title: 'Tunisia',
    parents: '1003'
},
{
    id: '1027',
    title: 'Nigeria',
    parents: '1003'
},
{
    id: '1028',
    title: 'China',
    parents: '1003'
}];
