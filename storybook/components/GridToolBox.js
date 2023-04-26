import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import immutable from 'immutable';
import GridToolBox from '../../components/GridToolBox';
import MaterialUILayout from '../../components/MaterialUILayout';

class MultipleDialogsWrapper extends React.Component {
    render() {
        const copiedObj = Object.assign({}, actionButtonWIthMultimpleDialogs);
        const identifier = copiedObj.dialogs[0].identifier;
        const objectToPass = {identifier: identifier, message: 'test message'};
        copiedObj.onClick = () => { this.refs.gridToolBox.openRefDialogWithMessage(objectToPass); };
        return <div>
            <GridToolBox
                ref='gridToolBox'
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[copiedObj]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
                <p>Description: </p>
                <p>we set ref on GridToolBox instance ('gridToolBox'),
                    onClick function and pass identifier on every dialog object. <br />
                    When onClick function is triggered we call openRefDialogWithMessage from refs with identifier <br />
                    GridToolBox gets the wanted dialog by identifier passed and opens it
                </p>
            </div>
        </div>;
    }
}

storiesOf('GridToolBox', module)
    .add('Default', () => (
        <MaterialUILayout>
            <GridToolBox
                customTheme
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[actionLink, actionButton, actionButtonWithConfirmPopUp, actionButtonWithPopUpsDependingOnProperty, actionButtonWIthMultimpleDialogs]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p>Click on 'Show Filters'</p>
                <p>Edit btn is of type 'link'</p>
                <p>Action btn is of type 'button'</p>
                <p>Delete btn is of type 'buttonWithConfirmPopUp'</p>
                <p>Lock btn is of type 'buttonWithPopUpsDependingOnProperty'</p>
                <p>Approve btn is of type 'buttonWIthMultimpleDialogs'</p>
            </div>
        </MaterialUILayout>
    ))
    .add('Dropdown filter', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterDropDown]}
                actionButtonElements={[actionLink, actionButton, actionButtonWithConfirmPopUp]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
        </MaterialUILayout>
    ))
    .add('SearchBox filter', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterSearchBox]}
                actionButtonElements={[actionLink, actionButton, actionButtonWithConfirmPopUp]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
        </MaterialUILayout>
    ))
    .add('ActionLink', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[actionLink]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
            </div>
        </MaterialUILayout>
    ))
    .add('ActionButton', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[actionButton]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
            </div>
        </MaterialUILayout>
    ))
    .add('ActionButtonWithConfirmPopUp', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[actionButtonWithConfirmPopUp]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
            </div>
        </MaterialUILayout>
    ))
    .add('actionButtonWithPopUpsDependingOnProperty', () => (
        <MaterialUILayout>
            <GridToolBox
                filterElements={[filterDropDown, filterSearchBox]}
                actionButtonElements={[actionButtonWithPopUpsDependingOnProperty]}
                clearFilters={resetFiltersHanlder}
                selected={selected}
                checked={checked}
            />
            <div>
                <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
            </div>
        </MaterialUILayout>
    ))
    .add('actionButtonWIthMultimpleDialogs', () => (
        <MaterialUILayout>
            {/* <GridToolBox
          filterElements={[filterDropDown, filterSearchBox]}
          actionButtonElements={[actionButtonWIthMultimpleDialogs]}
          clearFilters={resetFiltersHanlder}
          selected={selected}
          checked={checked}
        />
        <div>
            <p style={{color: 'cornflowerblue'}}>Click on 'show buttons' to see the example</p>
        </div> */}
            <MultipleDialogsWrapper />
        </MaterialUILayout>
    ));

const checked = immutable.fromJS([{
    actorId: '1023',
    id: '1023',
    isEnabled: true,
    name: 'Cote d\'Ivoire',
    parents: 'Microcred',
    url: '/user/units/Cote d\'Ivoire/1023'
}]);

const filterDropDown = {
    type: 'dropDown',
    data: [{
        key: '1',
        name: 'Unlocked'
    }, {
        key: '0',
        name: 'Locked'
    }, {
        key: '2',
        name: 'Locked/Unlocked Who knows?'
    }],
    customTheme: true,
    canSelectPlaceholder: true,
    placeholder: 'Status',
    defaultValue: '1',
    onSelect: (node) => { action(node); },
    styles: {width: '200px'}
};

const filterSearchBox = {
    type: 'searchBox',
    defaultValue: 'defaoult value',
    placeholder: 'Search Business Unit',
    onSearch: (node) => { action(node); },
    styles: {width: '200px'}
};

const actionLink = {
    type: 'link',
    label: 'Edit',
    path: '/user/units/undefined/undefined'
};

const actionButton = {
    type: 'button',
    label: 'Action',
    isDisabled: false,
    onClick: (node) => { action('btn clicked'); }
};

const actionButtonWithConfirmPopUp = {
    type: 'buttonWithConfirmPopUp',
    label: 'Delete',
    confirmDialog: {
        cancelLabel: 'No',
        submitLabel: 'Yes',
        title: 'Warning',
        message: 'Are you sure you want to delete this organization/s?',
        cannotSubmit: false
    },
    onClick: (node) => { action(node); },
    disabled: false
};

const actionButtonWithPopUpsDependingOnProperty = {
    type: 'buttonWithPopUpsDependingOnProperty',
    label: 'Lock',
    oppositeLabel: 'Unlock',
    property: 'isEnabled',
    selectProperty: 'info.isEnabled',
    confirmDialog: {
        cancelLabel: 'No',
        submitLabel: 'Yes',
        title: 'Warning',
        message: 'Are you sure you want to lock/unlock this organization/s?',
        onClick: (node) => { action(node); },
        cannotSubmit: false
    },
    errorDialog: {
        cancelLabel: 'Close',
        title: 'Error',
        message: 'You have selected organizations with different status',
        cannotSubmit: true
    },
    isDisabled: false
};

const actionButtonWIthMultimpleDialogs = {
    type: 'buttonWIthMultimpleDialogs',
    label: 'Approve',
    isDisabled: false,
    onClick: (node) => { action('handle validate for example'); },
    dialogs: [{
        identifier: 'identifier31paC',
        cancelLabel: 'Cancel',
        submitLabel: 'Ok',
        title: 'Error',
        message: 'test message',
        cannotSubmit: true,
        onSubmit: (node) => { action('submit'); }
    }, {
        identifier: 'identifieroFcvu',
        cancelLabel: 'No',
        submitLabel: 'Yes',
        title: 'Warning',
        message: 'nekav message',
        cannotSubmit: true,
        onSubmit: (node) => { action('submit'); }
    }]
};

const resetFiltersHanlder = () => {
    // call reset function to get data into intial state (after using some filters)
};

const selected = immutable.fromJS({
    role: {
        actorId: '1032',
        name: 'Madagascar_UserChecker',
        description: 'role for Madagascar user admin module',
        isEnabled: true,
        isDeleted: false,
        policyId: 3,
        url: '/user/roles/Madagascar_UserChecker/1032'
    },
    visibleFor: [{
        actorId: '1024',
        organizationName: 'Madagascar'
    }],
    assignedRoles: [{
        actorId: '1015',
        name: 'MC_UserCheckerAdmin'
    }]
});
