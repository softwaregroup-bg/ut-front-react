import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Text from '../Text';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class DialogExampleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: props.message
        };
        this.open = (msg) => this.setState({
            open: true,
            message: msg || this.props.message
        });
        this.close = () => {
            this.handleClose();
        };
        this.submit = () => {
            this.props.onSubmit();
            this.close();
        };
    }

    handleClose() {
        this.props.onClose();
        this.setState({
            open: false,
            message: this.props.message // Reset
        });
    }

    componentWillReceiveProps({message}) {
        if (this.props.message !== message) {
            this.setState({message});
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    fullWidth
                    open={this.state.open}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle id='alert-dialog-title'><Text>{this.props.title}</Text></DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            <Text>{this.props.message}</Text>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {!this.props.cannotSubmit && <Button disabled={this.props.cannotSubmit} onClick={this.submit}><Text>{this.props.submitLabel || 'Yes'}</Text></Button>}
                        <Button color='primary' onClick={this.close}>
                             <Text>{this.props.cancelLabel || 'No'}</Text>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

DialogExampleModal.propTypes = {
    cannotSubmit: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    submitLabel: PropTypes.string,
    cancelLabel: PropTypes.string
};

DialogExampleModal.defaultProps = {
    submitLabel: 'Submit',
    cancelLabel: 'Cancel',
    onSubmit: () => {},
    onClose: () => {},
    message: ''
};
