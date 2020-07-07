import React from 'react';
import { storiesOf } from '@storybook/react';
import MaterialUILayout from '../../components/MaterialUILayout';
import RaisedButton from '@material-ui/core/RaisedButton';

storiesOf('MaterialUILayout', module)
    .add('Default', () => (
        <MaterialUILayout>
            <RaisedButton label='Default' />
        </MaterialUILayout>
    ));
