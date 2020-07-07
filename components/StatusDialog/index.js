import PropTypes from 'prop-types';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const StatusDialog = ({ status, onClose }) => {
    const actions = [];

    const isOpen = status.size > 0;
    const statusString = status.get('status');
    if (statusString !== 'pending') {
        actions.push(<Button label='Ok' onClick={onClose} />);
    }

    const upperCasedStatus = statusString ? statusString.toUpperCase() : '';
    const message = status.get('message');
    const displayMsg = [];
    if (upperCasedStatus) {
        displayMsg.push(upperCasedStatus);
    }
    if (message) {
        displayMsg.push(message);
    }

    return (
        <div>
            <Dialog actions={actions} modal open={isOpen}>
                <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} />
            </Dialog>
        </div>
    );
};

StatusDialog.propTypes = {
    status: PropTypes.object.isRequired, // immutalbe object,
    onClose: PropTypes.func.isRequired
};

export default StatusDialog;
