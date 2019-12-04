import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import DropdownSelect from '../../components/DropdownSelect';
import MaterialUILayout from '../../components/MaterialUILayout';
let emptyFunc = function(e) { };
let actionSelect = function(e) { action('select'); };
let actionClicked = function(e) { action('clicked'); };
let actionError = function(e) { action(e); };

storiesOf('DropdownSelect', module)
    .add('Default', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                placeholder='test placeholder'
                defaultSelected={2}
                onSelect={actionSelect}
                onClick={actionClicked}
                canSelectPlaceholder={false}
                updateError={actionError}
            />
        </MaterialUILayout>
    ))
    .add('default selected', () => (
        <MaterialUILayout>
            <DropdownSelect
                data={data}
                customTheme
                defaultSelected={'2'}
                onSelect={emptyFunc}
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
                onSelect={emptyFunc}
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
                onSelect={actionSelect}
                onClick={actionClicked}
                keyProp='key'
                valueProp='name'
                canSelectPlaceholder
                showPlaceHolderAsFirstOption={false}
                isValid
                errorMessage=''
                updateError={actionError}
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
