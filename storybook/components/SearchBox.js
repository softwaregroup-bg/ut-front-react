import React from 'react';
import { storiesOf, action } from '@storybook/react';
import SearchBox from '../../components/SearchBox';

storiesOf('SearchBox', module)
    .add('Default', () => (
        <SearchBox
            placeholder='test placeholder'
            defaultValue='default value'
            onSearch={action}
            clearOnSearch={false}
        />
    ))
    .add('clear after search and without default value', () => (
        <SearchBox
            placeholder='test placeholder'
            onSearch={action}
            clearOnSearch
        />
    ));
