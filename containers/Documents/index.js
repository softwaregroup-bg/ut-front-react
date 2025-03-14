import immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { documentPrefix } from '../../constants';
import {
    addDocument,
    changeDocumentFilter,
    changeDocumentStatusArchived,
    changeDocumentStatusDeleted,
    fetchArchivedDocuments,
    fetchDocumentTypes,
    initState,
    replaceDocument,
    selectAttachments,
    uploadDocument
} from './actions';

import DocumentsListing from '../../components/Documents/Listing';

class DocumentsContainer extends Component {
    constructor(props) {
        super(props);
        this.initState = this.initState.bind(this);
        this.fetchDocumentTypes = this.fetchDocumentTypes.bind(this);
    }

    componentWillMount() {
        this.initState(this.props.identifier, this.props.pathname);
    }

    componentDidMount() {
        this.fetchDocumentTypes(this.props.documentTypes.get('requiresFetch'), this.props.documentTypes.get('isLoading'));
    }

    componentWillReceiveProps(newProps) {
        this.initState(newProps.identifier, newProps.pathname);
        this.fetchDocumentTypes(newProps.documentTypes.get('requiresFetch'), newProps.documentTypes.get('isLoading'));
    }

    initState(identifier, pathname) {
        if (this.props.attachments.get(identifier) === undefined) {
            this.props.initState(identifier, pathname);
        }
    }

    fetchDocumentTypes(requiresFetch, isLoading) {
        if (!this.props.loadTypesByParent && requiresFetch && !isLoading && this.props.identifier && this.props.documentTypeClass) {
            this.props.fetchDocumentTypes(this.props.identifier, this.props.documentTypeClass);
        }
    }

    render() {
        const {
            identifier,
            actorId,
            attachments,
            documents,
            countries,
            documentsChanged,
            fetchArchivedDocuments,
            selectAttachments,
            permissions,
            documentTypes,
            selectedFilter,
            documentArchived,
            documentTypeClass,
            validationConfig,
            hideDocumentTypeIds
        } = this.props;
        const selectedAttachment = attachments.getIn([identifier, 'selected']);
        const requiresFetch = attachments.getIn([identifier, 'remoteDocuments', 'requiresFetch']);
        const isLoading = attachments.getIn([identifier, 'remoteDocuments', 'isLoading']);
        const docTypes = documentTypes.get('data') ? documentTypes.get('data').toJS() : [];
        let docs = documents;
        let docsChanged = documentsChanged.toJS();
        if (selectedFilter && selectedFilter === 'archived') {
            docs = documentArchived.get('data').toJS();
            docsChanged = [];
        }
        return (
            <DocumentsListing
                identifier={identifier}
                actorId={actorId}
                documents={docs}
                countries={countries}
                documentsChanged={docsChanged}
                selectedAttachment={selectedAttachment}
                requiresFetch={requiresFetch}
                isLoading={isLoading}
                validationConfig={validationConfig}
                hideDocumentTypeIds={hideDocumentTypeIds}
                fetchArchivedDocuments={fetchArchivedDocuments}
                onGridSelect={selectAttachments}
                permissions={permissions}
                documentTypes={docTypes}
                documentTypeClass={documentTypeClass}
                uploadURL={this.props.uploadURL}
                uploadNewDocument={(newObject) => {
                    const formatedObj = {
                        createdDate: newObject.createdDate,
                        description: newObject.description,
                        documentType: newObject.documentType,
                        documentTypeId: newObject.documentTypeId,
                        documentNumber: newObject.documentNumber,
                        expirationDate: newObject.expirationDate,
                        issueDate: newObject.issueDate,
                        issuedBy: newObject.issuedBy,
                        statusId: newObject.statusId,
                        countryId: newObject.countryId,
                        attachments: [
                            {
                                filename: newObject.filename,
                                hash: newObject.filename,
                                extension: newObject.extension,
                                contentType: newObject.contentType,
                                url: documentPrefix + newObject.filename
                            }
                        ]
                    };
                    this.props.addDocument(identifier, formatedObj);
                }}
                replaceDocument={(replaceObject) => {
                    this.props.replaceDocument(identifier, selectedAttachment.toJS(), replaceObject);
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
                uploadDocument={async(params) => {
                    return await this.props.uploadDocument(params);
                }}
                selectedFilter={selectedFilter}
                documentArchived={documentArchived}
                mode={this.props.mode}
            />
        );
    }
}

DocumentsContainer.propTypes = {
    identifier: DocumentsListing.propTypes.identifier,
    actorId: DocumentsListing.propTypes.actorId,
    attachments: PropTypes.object, // immutable list
    documents: PropTypes.array,
    countries: PropTypes.array,
    hideDocumentTypeIds: PropTypes.array,
    documentsChanged: PropTypes.object, // immutable list
    validationConfig: PropTypes.object,
    fetchArchivedDocuments: DocumentsListing.propTypes.fetchArchivedDocuments,
    initState: PropTypes.func,
    selectAttachments: PropTypes.func,
    fetchDocumentTypes: PropTypes.func,
    changeDocumentFilter: PropTypes.func,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object
    documentTypeClass: PropTypes.string.isRequired,
    uploadURL: PropTypes.string,
    loadTypesByParent: PropTypes.bool,

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: PropTypes.object,
    changeDocumentStatusDeleted: PropTypes.func.isRequired,
    changeDocumentStatusArchived: PropTypes.func.isRequired,
    replaceDocument: PropTypes.func.isRequired,
    addDocument: PropTypes.func.isRequired,
    uploadDocument: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired
};

export default connect(
    ({ frontDocuments }, props) => {
        return {
            attachments: frontDocuments,
            documentsChanged: frontDocuments.getIn([props.identifier, 'changedDocuments']) || immutable.fromJS([]),
            documentTypes: props.documentTypes || frontDocuments.getIn([props.identifier, 'documentTypes']) || immutable.fromJS({}),
            selectedFilter: frontDocuments.getIn([props.identifier, 'selectedFilter']),
            documentArchived: frontDocuments.getIn([props.identifier, 'documentArchived']) || immutable.fromJS({}),
            loadTypesByParent: props.loadTypesByParent || false,
            mode: props.mode || 'default'
        };
    },
    { initState, fetchArchivedDocuments, selectAttachments, fetchDocumentTypes, addDocument, replaceDocument, changeDocumentStatusDeleted, changeDocumentStatusArchived, changeDocumentFilter, uploadDocument }
)(DocumentsContainer);
