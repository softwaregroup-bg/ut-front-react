import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SelectableSearch from '../../components/SelectableSearch';
import MaterialUILayout from '../../components/MaterialUILayout';

storiesOf('SelectableSearch', module)
.add('Default', () => (
    <MaterialUILayout><SelectableSearch /></MaterialUILayout>
));
