import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TimePicker from './../../components/TimePicker/Simple';
import TimePickerRange from './../../components/TimePicker/Range';
import MaterialUILayout from '../../components/MaterialUILayout';

let selectedFrom = '08:00';
let selectedTo = '18:00';

storiesOf('TimePicker', module)
.add('Default TimePicker', () => (
        <MaterialUILayout>
            <TimePicker />
        </MaterialUILayout>
))
.add('Disabled TimePicker', () => (
        <MaterialUILayout>
            <TimePicker
              disabled
            />
        </MaterialUILayout>
))
.add('Default TimePickerRange', () => (
        <MaterialUILayout>
            <TimePickerRange
              disabled={false}
              onChangeFrom={function(event) { /* console.log(event); */action('event'); }}
              onChangeTo={function(event) { /* console.log(event); */action('event'); }}
            //   onChangeFrom={action('event')}
            //   onChangeTo={action('event')}
            />
        </MaterialUILayout>
))
.add('TimePickerRange disabled', () => (
        <MaterialUILayout>
            <TimePickerRange
              disabled
            />
        </MaterialUILayout>
))
.add('TimePickerRange default selected values', () => (
        <MaterialUILayout>
            <TimePickerRange
              disabled={false}
              onChangeFrom={function(event) { selectedFrom = event.value; }}
              onChangeTo={function(event) { selectedTo = event.value; }}
              defaultSelectedFrom={selectedFrom}
              defaultSelectedTo={selectedTo}
            />
        </MaterialUILayout>
));
