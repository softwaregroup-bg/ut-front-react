import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import InlineEditor from '../../components/InlineEditor';

storiesOf('InlineEditor', module)
    .add('Default', () => (
        <InlineEditor
            text='test text'
            item={{a: 'a'}}
            onFinish={action}
        />
    ));
