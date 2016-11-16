import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Immutable from 'immutable';
import MaterialUILayout from '../../components/MaterialUILayout';
import AdvancedPagination from '../../components/AdvancedPagination';

const marginTopStyles = {marginTop: '125px'};

const paginationDefault = Immutable.Map({
    pageNumber: 1,
    pageSize: 25,
    recordsTotal: 25 * 20
    // pagesTotal - not required
});

const itemsPerPageData = [5, 10, 15, 20, 25, 30];
const onUpdate = (data) => { action()(data.toJS()); };

const paginationWithMiddlePaginationNumber = paginationDefault.set('pageNumber', 10);
const paginationWithHighPaginationNumber = paginationDefault.set('pageNumber', 19);
const paginationWithFewPages = paginationDefault.set('recordsTotal', 225);

const paginationWithFewPageBoxesWhenClickOnPoints = paginationDefault.set('recordsTotal', 300);
const paginationWithMaxPageBoxesWhenClickOnPoints = paginationDefault.set('recordsTotal', 600);
const paginationWithMaxPageBoxesOnBothSidesWhenClickOnPoints = paginationDefault.set('pageNumber', 20).set('recordsTotal', '975');

storiesOf('AdvancedPagination', module)
.add('Default', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationDefault} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with custom itemsPerPageData', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationDefault} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with middle pagination number', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithMiddlePaginationNumber} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with high pagination number', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithHighPaginationNumber} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with few pages', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithFewPages} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with few pageBoxes when click on points', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithFewPageBoxesWhenClickOnPoints} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with max pageBoxes when click on points', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithMaxPageBoxesWhenClickOnPoints} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
))
.add('with max pageBoxes on both sides when click on points', () => (
    <div style={marginTopStyles}>
        <MaterialUILayout>
            <AdvancedPagination pagination={paginationWithMaxPageBoxesOnBothSidesWhenClickOnPoints} itemsPerPageData={itemsPerPageData} onUpdate={onUpdate} />
        </MaterialUILayout>
    </div>
));
