import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
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
        let handleButtonClick = () => this.refs['confirmDialog'].open();
        let actionNodeF = function(node) { action(node); };
        return (
            <MaterialUILayout>
                <div>
                    <ConfirmDialog
                        cancelLabel='no'
                        ref='confirmDialog'
                        submitLabel='yes'
                        title='test title'
                        message='are you sure?'
                        onSubmit={actionNodeF}
                        cannotSubmit={false}
                    />
                    <button onClick={handleButtonClick}>open confirmation</button>
                </div>
            </MaterialUILayout>
        );
    }
}
