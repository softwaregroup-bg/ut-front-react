import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const StatusDialog = ({ status, onClose, autoScrollBodyContent }) => {
    var actions = [];

    let isOpen = status.size > 0;
    let statusString = status.get('status');
    if (statusString !== 'pending') {
        actions.push(<FlatButton label='Ok' onTouchTap={onClose} />);
    }

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
            <Dialog actions={actions} modal open={isOpen} autoScrollBodyContent={autoScrollBodyContent}>
                <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} />
            </Dialog>
        </div>
    );
};

StatusDialog.propTypes = {
    status: PropTypes.object.isRequired, // immutalbe object,
    onClose: PropTypes.func.isRequired,
    autoScrollBodyContent: PropTypes.any
};

export default StatusDialog;
