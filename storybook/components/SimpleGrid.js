import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { SimpleGrid } from './../../components/SimpleGrid';
import ContextWrapper from './../ContextWrapper.js';

const fields = [{
    title: 'col 1',
    name: 'firstName'
}, {
    title: 'col 2',
    name: 'lastName'
}, {
    title: 'col 3',
    name: 'age'
}];

const data = [{
    firstName: 'pesho',
    lastName: 'peshov',
    age: 19
}, {
    firstName: 'gosho',
    lastName: 'goshov',
    age: 21
}];

storiesOf('SimpleGrid', module)
.add('SimpleGrid default', () => (
    <ContextWrapper>
        <div>
            <SimpleGrid fields={fields} data={data} />
            <p style={{color: 'cornflowerblue'}}>styles comes from context</p>
        </div>
    </ContextWrapper>
));
