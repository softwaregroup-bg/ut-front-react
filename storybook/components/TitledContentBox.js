import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TitledContentBox from '../../components/TitledContentBox';

storiesOf('TitledContentBox', module)
.add('Default', () => (
    <TitledContentBox
      title='test title'
      headRightWrap='test right wrap'
    >
        Content
    </TitledContentBox>
));
