import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Text from '../Text';
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
            actions.push(<FlatButton label={this.props.submitLabel || 'Yes'} disabled={this.props.cannotSubmit} onTouchTap={this.submit} />);
        }
        actions.push(<FlatButton label={this.props.cancelLabel || 'No'} primary onTouchTap={this.close} />);

        return (
            <div>
                <Dialog title={this.props.title} actions={actions} modal open={this.state.open}>
                    {this.state.message ? <Text>{this.state.message}</Text> : this.state.message}
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
