import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Preloader from '../../components/Preloader';
import MaterialUILayout from '../../components/MaterialUILayout';

storiesOf('Preloader', module)
    .add('Default', () => (
        <MaterialUILayout>
            <Preloader>
                Message
            </Preloader>
        </MaterialUILayout>
    ));
