import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Search from '../../components/Search';

storiesOf('Search', module)
.add('Default', () => (
    <Search
      wrapper={{
          className: 'wrapper-classname'
      }}
      searchInput={{
          className: 'input-classname',
          onChange: function() {}
      }}
      searchBtn={{
          className: 'btn-classname',
          value: 'submit',
          onSubmit: function() {}
      }}
      search={function(text) { action(text); }}
    />
));
