import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import immutable from 'immutable';
import { getListTableColumns, getListTdStyles } from './helpers';

import { Vertical } from '../Layout';
import ButtonsHeader from '../ButtonsHeader';
import Grid from '../Grid';
import Text from '../Text';
import DateComponent from '../Date';
import Popup from '../Popup';
import Dropdown from '../Input/Dropdown';
// import AdvancedPagination from '../AdvancedPagination';
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
        this.fetchArchivedDocs = this.fetchArchivedDocs.bind(this);
        this.mapColumn = this.mapColumn.bind(this);
    }

    componentWillMount() {
        this.fetchDocs(this.props.actorId, this.props.fetchFilters, this.props.requiresFetch, this.props.isLoading);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.actorId !== nextProps.actorId || nextProps.requiresFetch) {
            this.fetchDocs(nextProps.actorId, nextProps.fetchFilters, nextProps.requiresFetch, nextProps.isLoading);
        }
        if (nextProps.selectedFilter === 'archived' && nextProps.documentArchived.get('requiresFetch')) {
            this.fetchArchivedDocs(nextProps.actorId, nextProps.documentArchived.get('requiresFetch'), nextProps.documentArchived.get('isLoading'));
        }
    }

    fetchDocs(actorId, fetchFilters, requiresFetch, isLoading) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchDocuments(actorId, fetchFilters, this.props.identifier);
        }
    }

    fetchArchivedDocs(actorId, requiresFetch, isLoading) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchArchivedDocuments(actorId, this.props.fetchFilters, this.props.identifier);
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
                disabled: this.props.selectedFilter === 'archived',
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
                    disabled: disabledButtonsState || (selectedAttachment && selectedAttachment.get('statusId') === 'deleted') || this.props.selectedFilter === 'archived',
                    onClick: openDeleteConfirmationDialog
                });
            }
            if (this.props.permissions.replace) {
                headerButtonsConfig.left.push({
                    label: 'Replace',
                    disabled: disabledButtonsState || (selectedAttachment && selectedAttachment.get('statusId') === 'new') || this.props.selectedFilter === 'archived',
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
                          className: style.deleteDialogFooter,
                          actionButtons: deletePopupActionButtons
                      }}
                    >
                        <Text>Are you sure you want to delete this document</Text>?
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
            if (colData === 'approved') {
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
        let { identifier, activeAttachments, /* fetchFilters, */ onGridSelect, /* updatePagination, */ updateOrder, selectedFilter, documentArchived } = this.props;
        let handleSelectItem = (selectedItem, isSelected) => {
            onGridSelect(selectedItem, isSelected, identifier);
        };
        // let handlePaginationUpdate = (newPagination) => {
        //     updatePagination(newPagination, identifier);
        // };
        let handleSort = (col, val) => {
            updateOrder(col, val, identifier);
        };
        let gridData = immutable.List();
        switch (selectedFilter) {
            case 'all':
                gridData = activeAttachments;
                break;
            case 'archived':
                gridData = documentArchived.get('data');
                break;
            default:
                gridData = immutable.List();
        }

        if (gridData && gridData.size > 0) {
            return (
                <div>
                    <div>
                        <Grid
                          columns={getListTableColumns()}
                          rows={gridData}
                          canCheck={false}
                          mapColumn={this.mapColumn}
                          onSelect={handleSelectItem}
                          sortableColumns={[false, false, false, false, false]}
                          onSort={handleSort}
                          tdStyles={getListTdStyles()}
                        />
                    </div>
                    {/* <div id={style.paginationWrap}>
                        <AdvancedPagination pagination={fetchFilters.get('paging') || {pageSize: 25, pageNumber: 1}} onUpdate={handlePaginationUpdate} />
                    </div> */}
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
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object

    // funcs
    fetchDocuments: PropTypes.func.isRequired,
    fetchArchivedDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
    // onDelete: PropTypes.func,
    // updatePagination: PropTypes.func,
    updateOrder: PropTypes.func,
    changeDocumentFilter: PropTypes.func.isRequired,

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
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Documents;
