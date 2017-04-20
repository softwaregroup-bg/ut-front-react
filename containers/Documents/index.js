import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder } from './actions';

import DocumentsListing from '../../components/Documents/Listing';

class DocumentsContainer extends Component {
    render() {
        let { identifier, actorId, attachments, fetchDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder, permissions, documentTypes, uploadNewDocument } = this.props;
        let activeAttachments = attachments.getIn([identifier, 'attachments']);
        let selectedAttachment = attachments.getIn([identifier, 'selected']);
        let requiresFetch = attachments.getIn([identifier, 'requiresFetch']);
        let fetchFilters = attachments.getIn([identifier, 'filters']) || attachments.getIn(['common', 'filters']);

        return (
            <DocumentsListing
              identifier={identifier}
              actorId={actorId}
              activeAttachments={activeAttachments}
              selectedAttachment={selectedAttachment}
              requiresFetch={requiresFetch}
              fetchFilters={fetchFilters}
              fetchDocuments={fetchDocuments}
              onGridSelect={selectAttachments}
              onDelete={deleteAttachments}
              updatePagination={updatePagination}
              updateOrder={updateOrder}
              permissions={permissions}
              documentTypes={documentTypes}
              uploadNewDocument={uploadNewDocument}
            />
        );
    }
}

DocumentsContainer.propTypes = {
    identifier: DocumentsListing.propTypes.identifier,
    actorId: DocumentsListing.propTypes.actorId,
    attachments: PropTypes.object, // immutable object
    fetchDocuments: DocumentsListing.propTypes.fetchDocuments,
    selectAttachments: PropTypes.func,
    deleteAttachments: PropTypes.func,
    updatePagination: PropTypes.func,
    updateOrder: PropTypes.func,

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: DocumentsListing.propTypes.documentTypes,
    uploadNewDocument: DocumentsListing.propTypes.uploadNewDocument
};

export default connect(
    (state) => ({
        attachments: state.frontDocuments
    }),
    { fetchDocuments, selectAttachments, deleteAttachments, updatePagination, updateOrder }
)(DocumentsContainer);
