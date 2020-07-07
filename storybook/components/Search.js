import React from 'react';
import { storiesOf, action } from '@storybook/react';
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
            search={action}
        />
    ));
