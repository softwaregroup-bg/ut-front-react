import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import ButtonsHeader from '../ButtonsHeader';
import Text from '../Text';
import Popup from '../Popup';
import Dropdown from '../Input/Dropdown';
import FileDetailsPopup from './FileDetailsPopup';
import DocumentUploadWithForm from './DocumentUploadWithForm';
import style from './style.css';

class Toolbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            showDetailsPopUp: false,
            popupTitle: '',
            popupType: 'add', // 'add' or 'replace'
            showArchiveConfirmationPopup: false,
            showDeleteConfirmationPopup: false
        };
    }

    get header() {
        const { selectedAttachment, deleteDocument, selectedFilter, documents, documentArchived, archiveDocument } = this.props;

        const addNewDocumentHandler = () => {
            this.setState({
                isOpen: true,
                popupType: 'add',
                popupTitle: 'Add Document'
            });
        };
        const replaceDocumentHandler = () => {
            this.setState({
                isOpen: true,
                popupType: 'replace',
                popupTitle: 'Replace Document'
            });
        };

        const disabledButtonsState = !selectedAttachment;

        // Details
        const openDetailsDialog = () => {
            this.setState({ showDetailsPopUp: true });
        };
        const downloadButtonHandler = () => {
            const tempLink = document.createElement('a');
            const attachmentsToDownload = selectedAttachment.get('attachments')?.toJS();
            const attachments = Array.isArray(attachmentsToDownload) ? attachmentsToDownload : [attachmentsToDownload];
            attachments.forEach(element => {
                tempLink.href = element.url;
                tempLink.setAttribute('download', element.filename);
                tempLink.setAttribute('target', '_blank');
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            });
        };
        // Delete
        const openDeleteConfirmationDialog = () => {
            this.setState({ showDeleteConfirmationPopup: true });
        };
        const closeDeleteConfirmationDialog = () => {
            this.setState({ showDeleteConfirmationPopup: false });
        };
        const handleDeleteDocument = () => {
            this.setState({ showDeleteConfirmationPopup: false }, () => {
                deleteDocument(selectedAttachment);
            });
        };
        // Archive
        const openArchiveConfirmationDialog = () => {
            this.setState({ showArchiveConfirmationPopup: true });
        };
        const closeArchiveConfirmationDialog = () => {
            this.setState({ showArchiveConfirmationPopup: false });
        };
        const handleArchiveDocument = () => {
            this.setState({ showArchiveConfirmationPopup: false }, () => {
                archiveDocument(selectedAttachment);
            });
        };

        const headerButtonsConfig = {
            left: []
        };

        if (this.props.permissions.add) {
            headerButtonsConfig.left.push({
                label: '+ ' + 'Add Document',
                disabled: this.props.selectedFilter === 'archived',
                onClick: addNewDocumentHandler
            });
        }
        let displayButtons = false;
        if ((selectedFilter === 'all' && documents && documents.length > 0) ||
            (selectedFilter === 'archived' && documentArchived && documentArchived.get('data') && documentArchived.get('data').size > 0)) {
            displayButtons = true;
        }

        if (displayButtons) {
            if (this.props.permissions.view) {
                headerButtonsConfig.left.push({
                    label: 'Details',
                    disabled: disabledButtonsState,
                    onClick: openDetailsDialog
                });
            }
            if (this.props.permissions.download) {
                headerButtonsConfig.left.push({
                    label: 'Download',
                    disabled: disabledButtonsState,
                    onClick: downloadButtonHandler
                });
            }
            if (this.props.permissions.delete) {
                headerButtonsConfig.left.push({
                    label: 'Delete',
                    disabled: disabledButtonsState || (
                        (selectedAttachment &&
                            (selectedAttachment.get('statusId') === 'deleted' ||
                            selectedAttachment.get('statusId') === 'archived' ||
                            selectedAttachment.get('statusId') === 'pending' ||
                            selectedAttachment.get('statusId') === 'replaced')
                        ) ||
                            this.props.selectedFilter === 'archived'),
                    onClick: openDeleteConfirmationDialog
                });
            }
            if (this.props.permissions.replace) {
                headerButtonsConfig.left.push({
                    label: 'Replace',
                    disabled: disabledButtonsState || (
                        (selectedAttachment &&
                            (selectedAttachment.get('statusId') === 'deleted' ||
                            (selectedAttachment.get('statusId') === 'new' && !selectedAttachment.get('attachmentId')) ||
                            selectedAttachment.get('statusId') === 'archived' ||
                            selectedAttachment.get('statusId') === 'pending')) ||
                            this.props.selectedFilter === 'archived'),
                    onClick: replaceDocumentHandler
                });
            }
            if (this.props.permissions.archive) {
                headerButtonsConfig.left.push({
                    label: 'Archive',
                    disabled: disabledButtonsState || (
                        (selectedAttachment &&
                            (selectedAttachment.get('statusId') === 'deleted' ||
                            selectedAttachment.get('statusId') === 'new' ||
                            selectedAttachment.get('statusId') === 'archived' ||
                            selectedAttachment.get('statusId') === 'pending' ||
                            selectedAttachment.get('statusId') === 'replaced' ||
                            this.props.selectedFilter === 'archived')
                        )),
                    onClick: openArchiveConfirmationDialog
                });
            }
        }

        const deletePopupActionButtons = [{
            name: 'yes',
            styleType: 'primaryDialog',
            label: 'Yes',
            onClick: handleDeleteDocument
        }, {
            name: 'no',
            styleType: 'secondaryDialog',
            label: 'No',
            onClick: closeDeleteConfirmationDialog
        }];

        const archivePopupActionButtons = [{
            name: 'yes',
            styleType: 'primaryDialog',
            label: 'Yes',
            onClick: handleArchiveDocument
        }, {
            name: 'no',
            styleType: 'secondaryDialog',
            label: 'No',
            onClick: closeArchiveConfirmationDialog
        }];

        let documentsFilter;
        if (this.props.permissions.viewArchive) {
            const options = [{
                key: 'all',
                name: 'Active documents'
            }, {
                key: 'archived',
                name: 'Archived documents'
            }];
            const selected = this.props.selectedFilter || 'all';
            documentsFilter = (
                <Dropdown
                    data={options}
                    defaultSelected={selected}
                    canSelectPlaceholder={false}
                    placeholder='Filter'
                    keyProp='documentFilter'
                    onSelect={(obj) => {
                        this.props.changeDocumentFilter(obj.value);
                    }}
                />);
        }

        return (
            <div className={style.header}>
                {this.state.showDeleteConfirmationPopup &&
                    <Popup
                        isOpen
                        header={{text: 'Delete document'}}
                        closeOnOverlayClick
                        closeOnEsc
                        closePopup={closeDeleteConfirmationDialog}
                        footer={{
                            className: style.dialogFooter,
                            actionButtons: deletePopupActionButtons
                        }}
                    >
                        <Text>Are you sure you want to delete this document?</Text>
                    </Popup>}
                {this.state.showArchiveConfirmationPopup &&
                    <Popup
                        isOpen
                        header={{text: 'Archive document'}}
                        closeOnOverlayClick
                        closeOnEsc
                        closePopup={closeArchiveConfirmationDialog}
                        footer={{
                            className: style.dialogFooter,
                            actionButtons: archivePopupActionButtons
                        }}
                    >
                        <Text>Are you sure you want to archive this document?</Text>
                    </Popup>}
                <div className={style.toolbox}>
                    <div className={style.toolboxItem}>
                        <ButtonsHeader config={headerButtonsConfig} />
                    </div>
                    <div className={classnames(style.toolboxItem, style.filter)}>
                        {documentsFilter}
                    </div>
                </div>
            </div>
        );
    }

    get detailsView() {
        const { selectedAttachment } = this.props;

        if (selectedAttachment) {
            const closeHandler = () => {
                this.setState({ showDetailsPopUp: false });
            };
            let file = selectedAttachment.get('attachments').toJS();
            file = Array.isArray(file) ? file : [file];
            file = file.map(
                file => ({
                    content: file.url,
                    details: {
                        type: file.contentType,
                        extension: file.extension,
                        dateUploaded: selectedAttachment.get('createdDate'),
                        description: selectedAttachment.get('description'),
                        documentNumber: selectedAttachment.get('documentNumber'),
                        issueDate: selectedAttachment.get('issueDate'),
                        countryName: selectedAttachment.get('countryName'),
                        issuedBy: selectedAttachment.get('issuedBy'),
                        expirationDate: selectedAttachment.get('expirationDate'),
                        width: selectedAttachment.get('width'),
                        height: selectedAttachment.get('height')
                    }
                })
            );

            return (
                <FileDetailsPopup
                    isOpen={this.state.showDetailsPopUp}
                    header={{text: 'Preview Document'}}
                    closePopup={closeHandler}
                    file={file}
                />
            );
        } else {
            return <div />;
        }
    }

    get renderDocumentUplodDialog() {
        const closeHandler = () => {
            this.setState({
                isOpen: false
            });
        };
        return (
            <DocumentUploadWithForm
                isOpen={this.state.isOpen}
                header={{text: this.state.popupTitle}}
                closePopup={closeHandler}
                type={this.state.popupType}
                editValues={this.props.selectedAttachment && this.props.selectedAttachment.toJS()}
                uploadNewDocument={this.props.uploadNewDocument}
                uploadDocument={this.props.uploadDocument}
                replaceDocument={this.props.replaceDocument}
                documentTypes={this.props.documentTypes}
                allowedFileTypes={this.props.allowedFileTypes}
                uploadURL={this.props.uploadURL}
                countries={this.props.countries}
            />
        );
    }

    render() {
        return (
            <div className={style.headerWrap}>
                {this.header}
                {this.detailsView}
                {this.renderDocumentUplodDialog}
            </div>
        );
    }
}

Toolbox.propTypes = {
    documents: PropTypes.array,
    countries: PropTypes.array,
    selectedAttachment: PropTypes.object, // immutable object
    documentArchived: PropTypes.object, // immutable object
    selectedFilter: PropTypes.string,
    uploadURL: PropTypes.string,

    // funcs
    changeDocumentFilter: PropTypes.func.isRequired,

    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),

    uploadNewDocument: PropTypes.func.isRequired,
    replaceDocument: PropTypes.func.isRequired,
    deleteDocument: PropTypes.func.isRequired,
    archiveDocument: PropTypes.func.isRequired,
    uploadDocument: PropTypes.func.isRequired,
    allowedFileTypes: PropTypes.array,

    permissions: PropTypes.shape({
        add: PropTypes.bool,
        edit: PropTypes.bool,
        view: PropTypes.bool,
        download: PropTypes.bool,
        delete: PropTypes.bool,
        replace: PropTypes.bool,
        archive: PropTypes.bool,
        viewArchive: PropTypes.bool
    })
};

Toolbox.defaultProps = {
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Toolbox;
