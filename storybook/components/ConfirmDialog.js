import React, { Component } from 'react';
import { storiesOf, action } from '@storybook/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import MaterialUILayout from '../../components/MaterialUILayout';

storiesOf('ConfirmDialog', module)
    .add('Default', () => (
        <div>
            <Wrapper />
        </div>
    ));

class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilters: true,
            hasActiveFilters: false
        };
    }

    render() {
        const handleButtonClick = () => this.confirmDialog.open();
        return (
            <MaterialUILayout>
                <div>
                    <ConfirmDialog
                        cancelLabel='no'
                        ref={(c) => { this.confirmDialog = c; }}
                        submitLabel='yes'
                        title='test title'
                        message='are you sure?'
                        onSubmit={action}
                        cannotSubmit={false}
                    />
                    <button onClick={handleButtonClick}>open confirmation</button>
                </div>
            </MaterialUILayout>
        );
    }
}
