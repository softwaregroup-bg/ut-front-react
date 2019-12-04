import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import InlineEditor from '../../components/InlineEditor';
let functionAction = function(node) { action(node); };
storiesOf('InlineEditor', module)
    .add('Default', () => (
        <InlineEditor
            text='test text'
            item={{ a: 'a' }}
            onFinish={functionAction}
        />
    ));
