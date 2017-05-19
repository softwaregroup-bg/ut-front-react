import React, { Component, PropTypes } from 'react';
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
        let { selectedAttachment, deleteDocument, selectedFilter, activeAttachments, documentArchived, archiveDocument } = this.props;

        let addNewDocumentHandler = () => {
            this.setState({
                isOpen: true,
                popupType: 'add',
                popupTitle: 'Add Document'
            });
        };
        let replaceDocumentHandler = () => {
            this.setState({
                isOpen: true,
                popupType: 'replace',
                popupTitle: 'Replace Document'
            });
        };

        let disabledButtonsState = !selectedAttachment;

        // Details
        let openDetailsDialog = () => {
            this.setState({ showDetailsPopUp: true });
        };
        // Download button
        let downloadButtonHandler = () => {
            let tempLink = document.createElement('a');
            tempLink.href = selectedAttachment.get('url');
            tempLink.setAttribute('download', `${selectedAttachment.get('documentTypeId')}-${selectedAttachment.get('filename')}.${selectedAttachment.get('extension')}`);
            tempLink.setAttribute('target', '_blank');
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        };
        // Delete
        let openDeleteConfirmationDialog = () => {
            this.setState({ showDeleteConfirmationPopup: true });
        };
        let closeDeleteConfirmationDialog = () => {
            this.setState({ showDeleteConfirmationPopup: false });
        };
        let handleDeleteDocument = () => {
            this.setState({ showDeleteConfirmationPopup: false }, () => {
                deleteDocument(selectedAttachment);
            });
        };
        // Archive
        let openArchiveConfirmationDialog = () => {
            this.setState({ showArchiveConfirmationPopup: true });
        };
        let closeArchiveConfirmationDialog = () => {
            this.setState({ showArchiveConfirmationPopup: false });
        };
        let handleArchiveDocument = () => {
            this.setState({ showArchiveConfirmationPopup: false }, () => {
                archiveDocument(selectedAttachment);
            });
        };

        let headerButtonsConfig = {
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
        if ((selectedFilter === 'all' && activeAttachments && activeAttachments.size > 0) ||
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
                    disabled: disabledButtonsState || ((selectedAttachment && (selectedAttachment.get('statusId') === 'deleted' || selectedAttachment.get('statusId') === 'archived')) || this.props.selectedFilter === 'archived'),
                    onClick: openDeleteConfirmationDialog
                });
            }
            if (this.props.permissions.replace) {
                headerButtonsConfig.left.push({
                    label: 'Replace',
                    disabled: disabledButtonsState || ((selectedAttachment && ((selectedAttachment.get('statusId') === 'new' && !selectedAttachment.get('attachmentId')) || selectedAttachment.get('statusId') === 'archived')) || this.props.selectedFilter === 'archived'),
                    onClick: replaceDocumentHandler
                });
            }
            if (this.props.permissions.archive) {
                headerButtonsConfig.left.push({
                    label: 'Archive',
                    disabled: disabledButtonsState || ((selectedAttachment && (selectedAttachment.get('statusId') === 'new' || selectedAttachment.get('statusId') === 'archived' || selectedAttachment.get('statusId') === 'pending')) || this.props.selectedFilter === 'archived'),
                    onClick: openArchiveConfirmationDialog
                });
            }
        }

        let deletePopupActionButtons = [{
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

        let archivePopupActionButtons = [{
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
            let options = [{
                key: 'all',
                name: 'Active documents'
            }, {
                key: 'archived',
                name: 'Archived documents'
            }];
            let selected = this.props.selectedFilter || 'all';
            documentsFilter = (
                <Dropdown
                  data={options}
                  defaultSelected={selected}
                  canSelectPlaceholder={false}
                  placeholder={'Filter'}
                  keyProp={'documentFilter'}
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
                    </Popup>
                }
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
                    </Popup>
                }
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
        let { selectedAttachment } = this.props;

        if (selectedAttachment) {
            let closeHandler = () => {
                this.setState({ showDetailsPopUp: false });
            };
            let file = {
                content: selectedAttachment.get('url'),
                details: {
                    type: selectedAttachment.get('contentType'),
                    size: selectedAttachment.get('attachmentSizeId'),
                    dateUploaded: selectedAttachment.get('createdDate'),
                    description: selectedAttachment.get('documentDescription'),
                    width: selectedAttachment.get('width'),
                    height: selectedAttachment.get('height')
                }
            };

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
        let closeHandler = () => {
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
              replaceDocument={this.props.replaceDocument}
              documentTypes={this.props.documentTypes}
              allowedFileTypes={this.props.allowedFileTypes}
            />
        );
    }

    render() {
        return (
            <div className={style.documentsWrap}>
                {this.header}
                {this.detailsView}
                {this.renderDocumentUplodDialog}
            </div>
        );
    }
}

Toolbox.propTypes = {
    activeAttachments: PropTypes.object, // immutable list
    selectedAttachment: PropTypes.object, // immutable object
    documentArchived: PropTypes.object, // immutable object
    selectedFilter: PropTypes.string,

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
    requiresFetch: false,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Toolbox;
