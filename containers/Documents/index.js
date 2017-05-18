import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable from 'immutable';
import {
    initState,
    fetchDocuments,
    fetchArchivedDocuments,
    selectAttachments,
    fetchDocumentTypes,
    addDocument,
    replaceDocument,
    changeDocumentFilter,
    changeDocumentStatusDeleted,
    changeDocumentStatusArchived
} from './actions';

import DocumentsListing from '../../components/Documents/Listing';

class DocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.initState = this.initState.bind(this);
        this.fetchDocumentTypes = this.fetchDocumentTypes.bind(this);
    }

    componentWillMount() {
        this.initState(this.props.identifier, this.props.excludeAttachmentIds, this.props.pathname);
    }

    componentDidMount() {
        this.fetchDocumentTypes(this.props.documentTypes.get('requiresFetch'), this.props.documentTypes.get('isLoading'));
    }

    componentWillReceiveProps(newProps) {
        this.initState(newProps.identifier, newProps.excludeAttachmentIds, newProps.pathname);
        this.fetchDocumentTypes(newProps.documentTypes.get('requiresFetch'), newProps.documentTypes.get('isLoading'));
    }

    initState(identifier, excludeAttachmentIds, pathname) {
        if (this.props.attachments.get(identifier) === undefined) {
            this.props.initState(identifier, excludeAttachmentIds, pathname);
        }
    }

    fetchDocumentTypes(requiresFetch, isLoading) {
        if (requiresFetch && !isLoading && this.props.identifier && this.props.documentTypeClass) {
            this.props.fetchDocumentTypes(this.props.identifier, this.props.documentTypeClass);
        }
    }

    render() {
        let {
            identifier,
            actorId,
            attachments,
            fetchDocuments,
            fetchArchivedDocuments,
            selectAttachments,
            permissions,
            documentTypes,
            excludeAttachmentIds,
            selectedFilter,
            documentArchived
        } = this.props;
        let activeAttachments = attachments.getIn([identifier, 'attachmentsList']);
        let selectedAttachment = attachments.getIn([identifier, 'selected']);
        let requiresFetch = attachments.getIn([identifier, 'remoteDocuments', 'requiresFetch']);
        let isLoading = attachments.getIn([identifier, 'remoteDocuments', 'isLoading']);
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
              fetchDocuments={fetchDocuments}
              fetchArchivedDocuments={fetchArchivedDocuments}
              onGridSelect={selectAttachments}
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
                  this.props.changeDocumentStatusDeleted(identifier, documentObject);
              }}
              archiveDocument={(documentObject) => {
                  this.props.changeDocumentStatusArchived(identifier, documentObject);
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
    fetchDocumentTypes: PropTypes.func,
    changeDocumentFilter: PropTypes.func,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object
    documentTypeClass: PropTypes.string.isRequired,

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: PropTypes.object,
    // documentTypes: PropTypes.shape({
    //     requiresFetch: PropTypes.bool,
    //     isLoading: PropTypes.bool,
    //     data: DocumentsListing.propTypes.documentTypes
    // }),
    // updatedAttachments: DocumentsListing.propTypes.updatedAttachments,
    // uploadNewDocument: DocumentsListing.propTypes.uploadNewDocument,
    // deleteDocument: DocumentsListing.propTypes.deleteDocument,
    // archiveDocument: DocumentsListing.propTypes.archiveDocument,
    excludeAttachmentIds: PropTypes.array,
    changeDocumentStatusDeleted: PropTypes.func.isRequired,
    changeDocumentStatusArchived: PropTypes.func.isRequired,
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
    { initState, fetchDocuments, fetchArchivedDocuments, selectAttachments, fetchDocumentTypes, addDocument, replaceDocument, changeDocumentStatusDeleted, changeDocumentStatusArchived, changeDocumentFilter }
)(DocumentsContainer);
