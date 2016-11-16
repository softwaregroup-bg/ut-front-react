import React from 'react';
import { storiesOf } from '@kadira/storybook';
import CollapsableContent from '../../components/CollapsableContent';

storiesOf('CollapsableContent', module)
.add('Default', () => (
    <CollapsableContent
      visibleStyles={{maxWidth: '200px', minHeight: '200px'}}
      collapsedStyles={{width: '40px', minHeight: '200px'}}
    >
        Content
    </CollapsableContent>
));
