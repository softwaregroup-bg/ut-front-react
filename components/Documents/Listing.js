import React, { Component, PropTypes } from 'react';
import { getListTableColumns, getListTdStyles } from './helpers';

import { Vertical } from '../Layout';
import ButtonsHeader from '../ButtonsHeader';
import Grid from '../Grid';
import Text from '../Text';
import DateComponent from '../Date';
import Popup from '../Popup';
import AdvancedPagination from '../AdvancedPagination';
import FileDetailsPopup from './FileDetailsPopup';
import { capitalizeFirstLetter } from '../../utils/helpers';

import DocumentUploadWithForm from './DocumentUploadWithForm';

import style from './style.css';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            showDetailsPopUp: false,
            popupTitle: '',
            popupType: 'add', // 'add' or 'replace'
            showDeleteConfirmationPopup: false
        };

        this.fetchDocs = this.fetchDocs.bind(this);
        this.mapColumn = this.mapColumn.bind(this);
    }

    componentWillMount() {
        this.fetchDocs(this.props.actorId, this.props.fetchFilters);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.actorId !== nextProps.actorId || nextProps.requiresFetch) {
            this.fetchDocs(nextProps.actorId, nextProps.fetchFilters);
        }
    }

    fetchDocs(actorId, fetchFilters) {
        if (actorId && this.props.requiresFetch && !this.props.isLoading) {
            this.props.fetchDocuments(actorId, fetchFilters, this.props.identifier);
        }
    }

    get header() {
        let { selectedAttachment, activeAttachments, deleteDocument } = this.props;

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

        let headerButtonsConfig = {
            left: []
        };

        if (this.props.permissions.add) {
            headerButtonsConfig.left.push({
                label: '+ ' + 'Add Document',
                onClick: addNewDocumentHandler
            });
        }

        if (activeAttachments && activeAttachments.size > 0) {
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
                    disabled: disabledButtonsState || (selectedAttachment && selectedAttachment.get('statusId') === 'deleted'),
                    onClick: openDeleteConfirmationDialog
                });
            }
            if (this.props.permissions.replace) {
                headerButtonsConfig.left.push({
                    label: 'Replace',
                    disabled: disabledButtonsState || (selectedAttachment && selectedAttachment.get('statusId') === 'new'),
                    onClick: replaceDocumentHandler
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
                          className: style.deleteDialogFooter,
                          actionButtons: deletePopupActionButtons
                      }}
                    >
                        <Text>Are you sure you want to delete this document</Text>?
                    </Popup>
                }
                <ButtonsHeader config={headerButtonsConfig} />
            </div>
        );
    }

    mapColumn(col, colData) {
        if (col.key === 'documentType') {
            // let handleClick = (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //     // open the preview dialog
            //     this.setState({ showDetailsPopUp: true });
            // };
            // return <a onClick={handleClick}>{capitalizeFirstLetter(colData)}</a>;
            return capitalizeFirstLetter(colData);
        }
        if (col.key === 'statusId') {
            let label = colData;
            if (colData === 'Approved') {
                label = 'active';
            }
            return capitalizeFirstLetter(label);
        }
        if (col.key === 'documentDescription') {
            return colData || '(no description)';
        }
        if (col.key === 'createdDate') {
            return <DateComponent>{colData}</DateComponent>;
        }
        return colData;
    }

    get content() {
        let { identifier, activeAttachments, fetchFilters, onGridSelect, updatePagination, updateOrder } = this.props;
        let handleSelectItem = (selectedItem, isSelected) => {
            onGridSelect(selectedItem, isSelected, identifier);
        };
        let handlePaginationUpdate = (newPagination) => {
            updatePagination(newPagination, identifier);
        };
        let handleSort = (col, val) => {
            updateOrder(col, val, identifier);
        };

        if (activeAttachments && activeAttachments.size > 0) {
            return (
                <div>
                    <div>
                        <Grid
                          columns={getListTableColumns()}
                          rows={activeAttachments}
                          canCheck={false}
                          mapColumn={this.mapColumn}
                          onSelect={handleSelectItem}
                          sortableColumns={[false, false, false, false, false]}
                          onSort={handleSort}
                          tdStyles={getListTdStyles()}
                        />
                    </div>
                    <div id={style.paginationWrap}>
                        <AdvancedPagination pagination={fetchFilters.get('paging') || {pageSize: 25, pageNumber: 1}} onUpdate={handlePaginationUpdate} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className={style.noUploadedDocumentsWrap}>
                    {/* <Text>No uploaded documents yet</Text>. */}
                </div>
            );
        }
    }

    get detailsVew() {
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
                {this.detailsVew}

                <Vertical
                  fixedComponent={this.header}
                  children={this.content}
                />
                {this.renderDocumentUplodDialog}
            </div>
        );
    }
}

Documents.propTypes = {
    /**
     *  identifier convention: module_tab_subtab
     *  e.g. In Customer module, Customers tab with Documents sub tab: customer_customers_documents
     */
    identifier: PropTypes.string.isRequired,
    actorId: PropTypes.number,
    activeAttachments: PropTypes.object, // immutable list
    selectedAttachment: PropTypes.object, // immutable object
    requiresFetch: PropTypes.bool,
    isLoading: PropTypes.bool,
    fetchFilters: PropTypes.object, // immutable object

    // funcs
    fetchDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
    // onDelete: PropTypes.func,
    updatePagination: PropTypes.func,
    updateOrder: PropTypes.func,

    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),

    uploadNewDocument: PropTypes.func,
    replaceDocument: PropTypes.func,
    deleteDocument: PropTypes.func,
    // archiveDocument: PropTypes.func,
    // updatedAttachments: PropTypes.object, // immutable list
    allowedFileTypes: PropTypes.array,
    // excludeAttachmentIds: PropTypes.array,

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

Documents.defaultProps = {
    requiresFetch: false,
    onGridSelect: () => {},
    // onDelete: () => {},
    updatePagination: () => {},
    updateOrder: () => {},
    allowedFileTypes: ['.jpg', 'jpeg', 'png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Documents;
