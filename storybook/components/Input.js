import React from 'react';
import immutable from 'immutable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { storiesOf, action } from '@kadira/storybook';
import { textValidations } from './../../validator/constants.js';
import Input from '../../components/Input';
import Dropdown from './../../components/Input/Dropdown';
import TimePicker from '../../components/Input/TimePicker';
import TextArea from '../../components/Input/TextArea';
import MaterialUILayout from '../../components/MaterialUILayout';

import MultiStateCheckbox from './../../components/Input/MultiStateCheckbox';
import Radio from './../../components/Input/Radio';
import Checkbox from './../../components/Input/Checkbox';

const errorMessage = 'Error! ni6to ne staa';

const person = immutable.Map({
    firstName: 'pesho'
});
const personValidators = [
    {type: textValidations.isRequired, errorMessage: 'First name is required.'},
    {type: textValidations.length, minVal: 2, maxVal: 70, errorMessage: 'First name should be between 2 and 70 symbols long.'}
];
const changeInput = (params) => {
    action(params);
};

const dropdownLanguages = [{
    key: 0,
    name: 'french'
}, {
    key: 1,
    name: 'english'
}, {
    key: 2,
    name: 'german'
}];

const radioData = [{
    id: 'id1',
    name: 'name1',
    label: 'label1',
    value: 'value1'
}, {
    id: 'id2',
    name: 'name2',
    label: 'label2',
    value: 'value2'
}];

const textAreaValidators = [
    {type: textValidations.isRequired, errorMessage: 'Description is required.'}
];

storiesOf('Inputs, (Text, Textarea, Dropdown, Date, Radio, ..., ..)', module)
.add('Default', () => (
    <Input
      value={person.get('firstName')}
      keyProp='firstName'
      onChange={changeInput}
      label='First Name'
      placeholder='Please enter name'
      isEdited={false}
      validators={personValidators}
      isValid
      errorMessage={personValidators.errorMessage}
    />
))
.add('Invalid', () => (
    <Input
      value={person.get('')}
      keyProp='firstName'
      onChange={changeInput}
      label='First Name'
      placeholder='Please enter name'
      isEdited={false}
      validators={personValidators}
      isValid={false}
      errorMessage={personValidators[0].errorMessage}
    />
))
.add('Without label', () => (
    <Input
      value={person.get('')}
      keyProp='firstName'
      onChange={changeInput}
      placeholder='Please enter name'
      isEdited={false}
      validators={personValidators}
      isValid={false}
      errorMessage={personValidators[0].errorMessage}
    />
))
.add('Edited', () => (
    <Input
      value={person.get('firstName')}
      keyProp='firstName'
      onChange={changeInput}
      placeholder='Please enter name'
      isEdited
      validators={personValidators}
      isValid
      errorMessage={personValidators[0].errorMessage}
    />
))
.add('Readonly', () => (
    <Input
      value={person.get('firstName')}
      readonly
    />
))
.add('Dropdown', () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Dropdown
          data={dropdownLanguages}
          keyProp='primaryLanguageId'
          placeholder='Select'
          canSelectPlaceholder
          label='Language'
          defaultSelected={2}
          onSelect={changeInput}
          isValid
          errorMessage={errorMessage}
          isEdited
        />
    </MuiThemeProvider>
))
.add('Dropdown default', () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Dropdown
          data={dropdownLanguages}
          keyProp='primaryLanguageId'
          placeholder='Select'
          canSelectPlaceholder
          defaultSelected={2}
          onSelect={changeInput}
          isValid
          errorMessage={errorMessage}
        />
    </MuiThemeProvider>
))
.add('Dropdown invalid', () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Dropdown
          data={dropdownLanguages}
          keyProp='primaryLanguageId'
          placeholder='Select'
          canSelectPlaceholder
          defaultSelected={2}
          onSelect={changeInput}
          isValid={false}
          errorMessage={errorMessage}
        />
    </MuiThemeProvider>
))
.add('Dropdown edited', () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Dropdown
          data={dropdownLanguages}
          keyProp='primaryLanguageId'
          isEdited
          placeholder='Select'
          canSelectPlaceholder
          label='Language'
          defaultSelected={2}
          onSelect={changeInput}
          isValid
          errorMessage={errorMessage}
        />
    </MuiThemeProvider>
))
.add('Checkbox', () => (
    <Checkbox
      onClick={changeInput}
      checked
      label={'Checkbox label'}
    />
))
.add('Checkbox unchecked', () => (
    <Checkbox
      onClick={changeInput}
      checked={false}
      label={'Checkbox label'}
    />
))
.add('MultiStateCheckbox', () => (
    <div>
        <MultiStateCheckbox
          label='multistatecheckbox label'
          onChange={changeInput}
          checked
          reload
          own
        />
        <p style={{color: 'cornflowerblue'}}>reload property is used in componentWillReceiveProps function to change checked from outside</p>
    </div>
))
.add('MultiStateCheckbox checked disabled', () => (
    <MultiStateCheckbox
      label='multistatecheckbox label'
      onChange={changeInput}
      checked
      reload
    />
))
.add('MultiStateCheckbox unchecked disabled', () => (
    <MultiStateCheckbox
      label='multistatecheckbox label'
      onChange={changeInput}
      reload
    />
))
.add('Radio', () => (
    <Radio
      label='radio label'
      onChange={changeInput}
      defaultValue='value2'
      options={radioData}
    />
))
.add('TextArea', () => (
    <TextArea
      value='test label'
      keyProp='test placeholder'
      label='TextArea label'
      onChange={changeInput}
      validators={textAreaValidators}
      isValid
      errorMessage={errorMessage}
    />
))
.add('TextArea invalid', () => (
    <TextArea
      value='test label'
      keyProp='role'
      label='TextArea label'
      onChange={changeInput}
      validators={textAreaValidators}
      isValid={false}
      errorMessage={errorMessage}
    />
))
.add('TextArea edited', () => (
    <TextArea
      value='test label'
      keyProp='test placeholder'
      onChange={changeInput}
      validators={textAreaValidators}
      isEdited
      isValid
      errorMessage={errorMessage}
    />
))
.add('TimePicker', () => (
  <MaterialUILayout>
    <TimePicker
      label='TimePicker label'
      value={new Date()}
      keyProp='workingHourStart'
      onChange={changeInput}
    />
    </MaterialUILayout>
))
.add('TimePicker edited', () => (
  <MaterialUILayout>
    <TimePicker
      label='TimePicker label'
      value={new Date()}
      keyProp='workingHourStart'
      onChange={changeInput}
      isEdited
    />
    </MaterialUILayout>
));

