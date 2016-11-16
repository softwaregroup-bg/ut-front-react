import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SearchBox from '../../components/SearchBox';

storiesOf('SearchBox', module)
.add('Default', () => (
    <SearchBox
      placeholder='test placeholder'
      defaultValue='default value'
      onSearch={function(text) { action(text); }}
      clearOnSearch={false}
    />
))
.add('clear after search and without default value', () => (
    <SearchBox
      placeholder='test placeholder'
      onSearch={function(text) { action(text); }}
      clearOnSearch
    />
));
