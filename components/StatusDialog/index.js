import PropTypes from 'prop-types';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const StatusDialog = ({ status, onClose }) => {
    const isOpen = status.size > 0;
    const statusString = status.get('status');

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
            <Dialog
                fullWidth
                open={isOpen}
                aria-describedby='alert-dialog-description'
            >
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {statusString !== 'pending' && <Button onClick={onClose}>Ok</Button>}
                </DialogActions>
            </Dialog>
        </div>
    );
};

StatusDialog.propTypes = {
    status: PropTypes.object.isRequired, // immutable object,
    onClose: PropTypes.func.isRequired
};

export default StatusDialog;
