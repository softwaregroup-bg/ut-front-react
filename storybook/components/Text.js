import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from '../../components/Text';

storiesOf('Text', module)
    .add('Default', () => (
        <Text>
        Content that should be translated
        </Text>
    ));
