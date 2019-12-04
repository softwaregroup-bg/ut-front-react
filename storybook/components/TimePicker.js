import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TimePicker from './../../components/TimePicker/Simple';
import TimePickerRange from './../../components/TimePicker/Range';
import MaterialUILayout from '../../components/MaterialUILayout';

let selectedFrom = '08:00';
let selectedTo = '18:00';
let functionEvent = function(event) { /* console.log(event); */action('event'); };
let onChangeFromF = function(event) { selectedFrom = event.value; };
let onChangeToF = function(event) { selectedTo = event.value; };

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
                onChangeFrom={functionEvent}
                onChangeTo={functionEvent}
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
                onChangeFrom={onChangeFromF}
                onChangeTo={onChangeToF}
                defaultSelectedFrom={selectedFrom}
                defaultSelectedTo={selectedTo}
            />
        </MaterialUILayout>
    ));
