import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable from 'immutable';
import {
    initState,
    fetchDocuments,
    fetchArchivedDocuments,
    selectAttachments,
    deleteAttachments,
    updatePagination,
    updateOrder,
    fetchDocumentTypes,
    addDocument,
    replaceDocument,
    changeDocumentFilter,
    changeDocumentStatusDeleted
} from './actions';

import DocumentsListing from '../../components/Documents/Listing';

class DocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.fetchDocumentTypes = this.fetchDocumentTypes.bind(this);
    }

    componentWillMount() {
        if (this.props.attachments.get(this.props.identifier) === undefined) {
            this.props.initState(this.props.identifier, this.props.excludeAttachmentIds, this.props.pathname);
        }
    }

    componentDidMount() {
        this.fetchDocumentTypes();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.documentTypes.get('requiresFetch') && !newProps.documentTypes.get('isLoading')) {
            this.fetchDocumentTypes();
        }
    }

    fetchDocumentTypes() {
        this.props.fetchDocumentTypes(this.props.identifier);
    }

    render() {
        let {
            identifier,
            actorId,
            attachments,
            fetchDocuments,
            fetchArchivedDocuments,
            selectAttachments,
            deleteAttachments,
            updatePagination,
            updateOrder,
            permissions,
            documentTypes,
            excludeAttachmentIds,
            selectedFilter,
            documentArchived
        } = this.props;
        let activeAttachments = attachments.getIn([identifier, 'attachmentsList']);
        let selectedAttachment = attachments.getIn([identifier, 'selected']);
        let requiresFetch = attachments.getIn([identifier, 'requiresFetch']);
        let isLoading = attachments.getIn([identifier, 'isLoading']);
        let fetchFilters = attachments.getIn([identifier, 'filters']) || attachments.getIn(['common', 'filters']);
        let docTypes = documentTypes.get('data') ? documentTypes.get('data').toJS() : [];
        return (
            <DocumentsListing
              identifier={identifier}
              actorId={actorId}
              activeAttachments={activeAttachments}
              selectedAttachment={selectedAttachment}
              // updatedAttachments={this.props.updatedAttachments}
              requiresFetch={requiresFetch}
              isLoading={isLoading}
              fetchFilters={fetchFilters}
              fetchDocuments={fetchDocuments}
              fetchArchivedDocuments={fetchArchivedDocuments}
              onGridSelect={selectAttachments}
              onDelete={deleteAttachments}
              updatePagination={updatePagination}
              updateOrder={updateOrder}
              permissions={permissions}
              documentTypes={docTypes}
              excludeAttachmentIds={excludeAttachmentIds}
              uploadNewDocument={(newObject) => {
                  this.props.addDocument(identifier, newObject);
              }}
              replaceDocument={(replaceObject) => {
                  this.props.replaceDocument(identifier, replaceObject);
              }}
              deleteDocument={(documentObject) => {
                  this.props.changeDocumentStatusDeleted(identifier, documentObject, 'deleted');
              }}
              archiveDocument={(documentObject) => {
                  // this.props.changeDocumentStatusDeleted(identifier, documentObject, 'archieved');
              }}
              changeDocumentFilter={(newFilter) => {
                  this.props.changeDocumentFilter(identifier, newFilter);
              }}
              selectedFilter={selectedFilter}
              documentArchived={documentArchived}
            />
        );
    }
}

DocumentsContainer.propTypes = {
    identifier: DocumentsListing.propTypes.identifier,
    actorId: DocumentsListing.propTypes.actorId,
    attachments: PropTypes.object, // immutable object
    fetchDocuments: DocumentsListing.propTypes.fetchDocuments,
    fetchArchivedDocuments: DocumentsListing.propTypes.fetchDocuments,
    initState: PropTypes.func,
    selectAttachments: PropTypes.func,
    deleteAttachments: PropTypes.func,
    updatePagination: PropTypes.func,
    updateOrder: PropTypes.func,
    fetchDocumentTypes: PropTypes.func,
    changeDocumentFilter: PropTypes.func,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: PropTypes.shape({
        requiresFetch: PropTypes.bool,
        isLoading: PropTypes.bool,
        data: DocumentsListing.propTypes.documentTypes
    }),
    // updatedAttachments: DocumentsListing.propTypes.updatedAttachments,
    // uploadNewDocument: DocumentsListing.propTypes.uploadNewDocument,
    // deleteDocument: DocumentsListing.propTypes.deleteDocument,
    // archiveDocument: DocumentsListing.propTypes.archiveDocument,
    excludeAttachmentIds: PropTypes.array,
    changeDocumentStatusDeleted: PropTypes.func.isRequired,
    replaceDocument: PropTypes.func.isRequired,
    addDocument: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired
};

export default connect(
    ({frontDocuments}, props) => {
        return {
            attachments: frontDocuments,
            documentTypes: frontDocuments.getIn([props.identifier, 'documentTypes']) || immutable.fromJS({}),
            selectedFilter: frontDocuments.getIn([props.identifier, 'selectedFilter']),
            documentArchived: frontDocuments.getIn([props.identifier, 'documentArchived']) || immutable.fromJS({})
            // updatedAttachments: frontDocuments.getIn([props.identifier, 'changedDocuments']) || immutable.fromJS([])
        };
    },
    { initState, fetchDocuments, fetchArchivedDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder, fetchDocumentTypes, addDocument, replaceDocument, changeDocumentStatusDeleted, changeDocumentFilter }
)(DocumentsContainer);
