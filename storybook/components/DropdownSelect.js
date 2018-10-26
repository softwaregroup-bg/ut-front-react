import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import DropdownSelect from '../../components/DropdownSelect';
import MaterialUILayout from '../../components/MaterialUILayout';

storiesOf('DropdownSelect', module)
    .add('Default', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                placeholder='test placeholder'
                defaultSelected={2}
                onSelect={action}
                onClick={action}
                canSelectPlaceholder={false}
                updateError={action}
            />
        </MaterialUILayout>
    ))
    .add('default selected', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                defaultSelected={'2'}
                onSelect={action}
            />
        </MaterialUILayout>
    ))
    .add('can select placeholder & showplaceholder as first option', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                placeholder='test placeholder'
                defaultSelected={2}
                canSelectPlaceholder
                showPlaceHolderAsFirstOption
                errorMessage=''
            />
        </MaterialUILayout>
    ))
    .add('invalid', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                defaultSelected={'2'}
                isValid={false}
                errorMessage='custom error'
                onSelect={action}
            />
        </MaterialUILayout>
    ))
    .add('all', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                placeholder='test placeholder'
                defaultSelected={2}
                onSelect={action}
                onClick={action}
                keyProp='key'
                valueProp='name'
                canSelectPlaceholder
                showPlaceHolderAsFirstOption={false}
                isValid
                errorMessage=''
                updateError={action}
            />
        </MaterialUILayout>
    ));

const data = [{
    key: '1', name: 'french'
}, {
    key: '2', name: 'english'
}, {
    key: '3', name: 'chinese'
}];
