import React, { Component, PropTypes } from 'react';
import { getListTableColumns, getListTdStyles } from './helpers';
import { documentPrefix } from '../../constants';

import { Vertical } from '../Layout';
import ButtonsHeader from '../ButtonsHeader';
import Grid from '../Grid';
import Text from '../Text';
import DateComponent from '../Date';
import Popup from '../Popup';
import AdvancedPagination from '../AdvancedPagination';
import FileDetailsPopup from './FileDetailsPopup';

import style from './style.css';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetailsPopUp: false,
            showDeleteConfirmationPopup: false
        };

        this.fetchDocs = this.fetchDocs.bind(this);
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
        let { identifier, fetchDocuments } = this.props;

        if (actorId) {
            fetchDocuments(actorId, fetchFilters, identifier);
        }
    }

    get header() {
        let { identifier, selectedAttachment, onDelete } = this.props;

        let button1Click1 = () => { /* console.log('Add new'); */ };
        let button1Click5 = () => { /* console.log('Replace'); */ };

        let disabledButtonsState = !selectedAttachment;

        // Details
        let openDetailsDialog = () => {
            this.setState({ showDetailsPopUp: true });
        };
        // Download button
        let downloadButtonHandler = () => {
            let fileTimestamp = new Date().getTime();
            let tempLink = document.createElement('a');
            tempLink.href = `${documentPrefix}${selectedAttachment.get('filename')}`;
            tempLink.setAttribute('download', `${selectedAttachment.get('documentTypeId')}-${fileTimestamp}.${selectedAttachment.get('extension')}`);
            tempLink.setAttribute('target', '_blank');
            tempLink.click();
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
                onDelete(selectedAttachment.get('documentId'), identifier);
            });
        };

        let headerButtonsConfig = {
            left: [
                {
                    label: 'Add Document',
                    onClick: button1Click1
                },
                {
                    label: 'Details',
                    disabled: disabledButtonsState,
                    onClick: openDetailsDialog
                },
                {
                    label: 'Download',
                    disabled: disabledButtonsState,
                    onClick: downloadButtonHandler
                },
                {
                    label: 'Delete',
                    disabled: disabledButtonsState,
                    onClick: openDeleteConfirmationDialog
                },
                {
                    label: 'Replace',
                    disabled: disabledButtonsState,
                    onClick: button1Click5
                }
            ]
        };

        let deletePopupActionButtons = [{
            name: 'no',
            styleType: 'primaryDialog',
            label: 'No',
            onClick: closeDeleteConfirmationDialog
        }, {
            name: 'yes',
            styleType: 'secondaryDialog',
            label: 'Yes',
            onClick: handleDeleteDocument
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
        if (col.key === 'statusId') {
            return colData.charAt(0).toUpperCase() + colData.slice(1);
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
                          sortableColumns={[true, true, true, true]}
                          onSort={handleSort}
                          tdStyles={getListTdStyles()}
                        />
                    </div>
                    <div id={style.paginationWrap}>
                        <AdvancedPagination pagination={fetchFilters.get('paging')} onUpdate={handlePaginationUpdate} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className={style.noUploadedDocumentsWrap}>
                    <Text>No uploaded documents yet</Text>.
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
                content: documentPrefix + selectedAttachment.get('filename'),
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

    render() {
        return (
            <div className={style.documentsWrap}>
                {this.detailsVew}

                <Vertical
                  fixedComponent={this.header}
                  children={this.content}
                />
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
    fetchFilters: PropTypes.object.isRequired, // immutable object

    // funcs
    fetchDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
    onDelete: PropTypes.func,
    updatePagination: PropTypes.func,
    updateOrder: PropTypes.func
};

Documents.defaultProps = {
    requiresFetch: false,
    onGridSelect: () => {},
    onDelete: () => {},
    updatePagination: () => {},
    updateOrder: () => {}
};

export default Documents;
