import React from 'react';
import { storiesOf } from '@kadira/storybook';
import CollapsableContent from '../../components/CollapsableContent';

storiesOf('CollapsableContent', module)
    .add('Default', () => (
        <CollapsableContent
            visibleStyles={{maxWidth: '500px', minHeight: '400px'}}
            collapsedStyles={{width: '40px', minHeight: '200px'}}
            heading='test heading'
            orientation='left'
            style={{width: '300px'}}
        >
        Content
        </CollapsableContent>
    ))
    .add('right orientation', () => (
        <CollapsableContent
            visibleStyles={{maxWidth: '400px', minHeight: '400px'}}
            collapsedStyles={{width: '40px', minHeight: '200px'}}
            orientation='right'
        >
        Content
        </CollapsableContent>
    ));
