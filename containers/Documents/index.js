import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable from 'immutable';
import {
    initState,
    fetchDocuments,
    selectAttachments,
    deleteAttachments,
    updatePagination,
    updateOrder,
    fetchDocumentTypes,
    addDocument,
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
            this.props.initState(this.props.identifier);
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
        let { identifier, actorId, attachments, fetchDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder, permissions, documentTypes, updatedAttachments } = this.props;
        let activeAttachments = attachments.getIn([identifier, 'attachments']);
        let selectedAttachment = attachments.getIn([identifier, 'selected']);
        let requiresFetch = attachments.getIn([identifier, 'requiresFetch']);
        let fetchFilters = attachments.getIn([identifier, 'filters']) || attachments.getIn(['common', 'filters']);
        let docTypes = documentTypes.get('data') ? documentTypes.get('data').toJS() : [];
        return (
            <DocumentsListing
              identifier={identifier}
              actorId={actorId}
              activeAttachments={activeAttachments}
              selectedAttachment={selectedAttachment}
              updatedAttachments={updatedAttachments}
              requiresFetch={requiresFetch}
              fetchFilters={fetchFilters}
              fetchDocuments={fetchDocuments}
              onGridSelect={selectAttachments}
              onDelete={deleteAttachments}
              updatePagination={updatePagination}
              updateOrder={updateOrder}
              permissions={permissions}
              documentTypes={docTypes}
              uploadNewDocument={(newObject) => {
                  this.props.addDocument(identifier, newObject);
              }}
              deleteDocument={(documentObject) => {
                  this.props.changeDocumentStatusDeleted(identifier, documentObject, 'deleted');
              }}
              archiveDocument={(documentObject) => {
                  // this.props.changeDocumentStatusDeleted(identifier, documentObject, 'archieved');
              }}
            />
        );
    }
}

DocumentsContainer.propTypes = {
    identifier: DocumentsListing.propTypes.identifier,
    actorId: DocumentsListing.propTypes.actorId,
    attachments: PropTypes.object, // immutable object
    fetchDocuments: DocumentsListing.propTypes.fetchDocuments,
    initState: PropTypes.func,
    selectAttachments: PropTypes.func,
    deleteAttachments: PropTypes.func,
    updatePagination: PropTypes.func,
    updateOrder: PropTypes.func,
    fetchDocumentTypes: PropTypes.func,

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: PropTypes.shape({
        requiresFetch: PropTypes.bool,
        isLoading: PropTypes.bool,
        data: DocumentsListing.propTypes.documentTypes
    }),
    updatedAttachments: DocumentsListing.propTypes.updatedAttachments,
    // uploadNewDocument: DocumentsListing.propTypes.uploadNewDocument,
    // deleteDocument: DocumentsListing.propTypes.deleteDocument,
    // archiveDocument: DocumentsListing.propTypes.archiveDocument,
    changeDocumentStatusDeleted: PropTypes.func.isRequired,
    addDocument: PropTypes.func.isRequired
};

export default connect(
    ({frontDocuments}, props) => {
        return {
            attachments: frontDocuments,
            documentTypes: frontDocuments.getIn([props.identifier, 'documentTypes']) || immutable.fromJS({}),
            updatedAttachments: frontDocuments.getIn([props.identifier, 'changedDocuments']) || immutable.fromJS([])
        };
    },
    { initState, fetchDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder, fetchDocumentTypes, addDocument, changeDocumentStatusDeleted }
)(DocumentsContainer);
