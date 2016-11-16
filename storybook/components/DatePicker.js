import React from 'react';
import { storiesOf } from '@kadira/storybook';
import DatePickerRange from './../../components/DatePicker/Between';
import DatePicker from './../../components/DatePicker/Simple';
import ContextWrapper from './../ContextWrapper.js';
// import DropdownSelect from '../../components/DropdownSelect';
import MaterialUILayout from '../../components/MaterialUILayout';

const defaultValue = {
    from: new Date(2000, 5, 5),
    to: new Date(2050, 5, 5)
};
const onChange = (params) => {};
const DateTimeFormat = Intl.DateTimeFormat;

storiesOf('DatePicker', module)
.add('Default DatePicker', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePicker
                  defaultValue={defaultValue}
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('Default DatePickerRange', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange with all labels', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  masterLabel='masterlabel test'
                  labelFrom='labelFrom test'
                  labelTo='labelTo test'
                  okLabel='save me'
                  cancelLabel='cancel me'
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange format', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  DateTimeFormat={DateTimeFormat}
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange mode portrait', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  mode='portrait'
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange container inline', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  container='inline'
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange other locale', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  locale='en-US'
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange other locale', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  locale='en-US'
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
))
.add('DatePickerRange first day of week in calendar', () => (
    <MaterialUILayout>
        <div>
            <ContextWrapper>
                <DatePickerRange
                  defaultValue={defaultValue}
                  firstDayOfWeek={4}
                  onChange={onChange} />
            </ContextWrapper>
        </div>
    </MaterialUILayout>
));
