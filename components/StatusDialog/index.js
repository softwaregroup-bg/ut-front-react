import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const StatusDialog = ({ status, onClose }) => {
    const actions = [
        <FlatButton label='Ok' onTouchTap={onClose} />
    ];

    let isOpen = status.size > 0;
    let statusString = status.get('status');
    let upperCasedStatus = statusString ? statusString.toUpperCase() : '';
    let message = status.get('message');
    let displayMsg = [];
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
