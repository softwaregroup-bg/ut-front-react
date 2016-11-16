import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Text from '../../components/Text';

storiesOf('Text', module)
.add('Default', () => (
    <Text>
        Content that should be translated
    </Text>
));
