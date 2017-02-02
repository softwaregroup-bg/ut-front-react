import React, { Component, PropTypes } from 'react';
import addFilePopupStyles from './styles.css';
import Popup from '../Popup';
import AddFileMenu from '../AddFileMenu';
import FileUpload from '../FileUpload';

export default class AddFilePopup extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            addFileOption: 'initial',
            file: null,
            showPreview: false,
            actionButtons: [{
                name: 'cancel',
                label: 'Cancel',
                className: 'actionBtn',
                onClick: this.props.closePopup
            }]
        };

        this.state = Object.assign({}, this.initialState);

        this.onAddFile = this.onAddFile.bind(this);
    }

    onAddFile(addFileOption, file) {
        this.setState({
            addFileOption,
            file
        });
    }
    componentWillReceiveProps(nextProps) {
        // This is done in order to reset the component's state because it doesn't get unmounted
        if (this.props.isOpen && !nextProps.isOpen) {
            this.setState(this.initialState);
        }
    }
    render() {
        let { isOpen, closePopup, hasOverlay, headerText, actionButtons } = this.props;

        return (
            <Popup className={addFilePopupStyles.addFilePopup}
              isOpen={isOpen}
              closePopup={closePopup}
              hasOverlay={hasOverlay}
              headerText={headerText}
              actionButtons={actionButtons || this.state.actionButtons}>
                {this.state.addFileOption === 'initial'? <AddFileMenu onAddFile={this.onAddFile} /> :
                <FileUpload file={this.state.file} uploadType={this.state.addFileOption} />}
            </Popup>
        );
    }
}

AddFilePopup.propTypes = {
    isOpen: PropTypes.bool,
    hasOverlay: PropTypes.bool,
    headerText: PropTypes.string,
    actionButtons: PropTypes.array,
    closePopup: PropTypes.func
};
