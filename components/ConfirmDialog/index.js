import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
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
        const actions = [];
        if (!this.props.cannotSubmit) {
            actions.push(<Button label={this.props.submitLabel || 'Yes'} disabled={this.props.cannotSubmit} onClick={this.submit} />);
        }
        actions.push(<Button label={this.props.cancelLabel || 'No'} primary onClick={this.close} />);

        return (
            <div>
                <Dialog title={this.props.title} actions={actions} modal open={this.state.open}>
                    {this.state.message}
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
