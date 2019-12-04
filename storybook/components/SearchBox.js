import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SearchBox from '../../components/SearchBox';
let functionAction = function(text) { action(text); };

storiesOf('SearchBox', module)
    .add('Default', () => (
        <SearchBox
            placeholder='test placeholder'
            defaultValue='default value'
            onSearch={functionAction}
            clearOnSearch={false}
        />
    ))
    .add('clear after search and without default value', () => (
        <SearchBox
            placeholder='test placeholder'
            onSearch={functionAction}
            clearOnSearch
        />
    ));
