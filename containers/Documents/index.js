import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import immutable from 'immutable';
import { documentTmpUploadPrefix } from '../../constants';
import {
    initState,
    fetchArchivedDocuments,
    selectAttachments,
    fetchDocumentTypes,
    addDocument,
    replaceDocument,
    changeDocumentFilter,
    changeDocumentStatusDeleted,
    changeDocumentStatusArchived
} from './actions';

import { logout } from '../../containers/LoginForm/actions';

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
        if (requiresFetch && !isLoading && this.props.identifier && this.props.documentTypeClass) {
            this.props.fetchDocumentTypes(this.props.identifier, this.props.documentTypeClass);
        }
    }

    addDocument = (newObject) => {
        let { identifier } = this.props;

        let formatedObj = {
            createdDate: newObject.createdDate,
            description: newObject.description,
            documentType: newObject.documentType,
            documentTypeId: newObject.documentTypeId,
            statusId: newObject.statusId,
            attachments: [
                {
                    filename: newObject.filename,
                    extension: newObject.extension,
                    contentType: newObject.contentType,
                    url: documentTmpUploadPrefix + newObject.filename
                }
            ]
        };
        this.props.addDocument(identifier, formatedObj);
        this.props.onAddDocument && this.props.onAddDocument(identifier, formatedObj);
    }

    render() {
        let {
            identifier,
            actorId,
            attachments,
            documents,
            documentsChanged,
            fetchArchivedDocuments,
            selectAttachments,
            permissions,
            documentTypes,
            disabledDocumentTypes,
            selectedFilter,
            documentArchived
        } = this.props;

        let selectedAttachment = attachments.getIn([identifier, 'selected']);
        let requiresFetch = attachments.getIn([identifier, 'remoteDocuments', 'requiresFetch']);
        let isLoading = attachments.getIn([identifier, 'remoteDocuments', 'isLoading']);
        let docTypes = documentTypes.get('data') ? documentTypes.get('data').toJS() : [];

        if (disabledDocumentTypes && disabledDocumentTypes.length > 0) {
            docTypes = docTypes.map(d => {
                const docType = d.key;

                const isDisabled = disabledDocumentTypes.includes(docType);

                return {
                    ...d,
                    disabled: isDisabled
                };
            });
        }

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
                documentsChanged={docsChanged}
                selectedAttachment={selectedAttachment}
                requiresFetch={requiresFetch}
                isLoading={isLoading}
                fetchArchivedDocuments={fetchArchivedDocuments}
                onGridSelect={selectAttachments}
                permissions={permissions}
                documentTypes={docTypes}
                uploadNewDocument={this.addDocument}
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
                selectedFilter={selectedFilter}
                documentArchived={documentArchived}
                clearLogin={() => {
                    this.props.logout && this.props.logout();
                }}
            />
        );
    }
}

DocumentsContainer.propTypes = {
    identifier: DocumentsListing.propTypes.identifier,
    actorId: DocumentsListing.propTypes.actorId,
    attachments: PropTypes.object, // immutable list
    documents: PropTypes.array,
    documentsChanged: PropTypes.object, // immutable list
    fetchArchivedDocuments: DocumentsListing.propTypes.fetchArchivedDocuments,
    initState: PropTypes.func,
    selectAttachments: PropTypes.func,
    fetchDocumentTypes: PropTypes.func,
    changeDocumentFilter: PropTypes.func,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object
    documentTypeClass: PropTypes.string.isRequired,
    disabledDocumentTypes: PropTypes.array,

    permissions: DocumentsListing.propTypes.permissions,
    documentTypes: PropTypes.object,
    changeDocumentStatusDeleted: PropTypes.func.isRequired,
    changeDocumentStatusArchived: PropTypes.func.isRequired,
    replaceDocument: PropTypes.func.isRequired,
    addDocument: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    logout: PropTypes.func,
    onAddDocument: PropTypes.func
};

export default connect(
    ({ frontDocuments }, props) => {
        return {
            attachments: frontDocuments,
            documentsChanged: frontDocuments.getIn([props.identifier, 'changedDocuments']) || immutable.fromJS([]),
            documentTypes: frontDocuments.getIn([props.identifier, 'documentTypes']) || immutable.fromJS({}),
            selectedFilter: frontDocuments.getIn([props.identifier, 'selectedFilter']),
            documentArchived: frontDocuments.getIn([props.identifier, 'documentArchived']) || immutable.fromJS({})
        };
    },
    { initState, fetchArchivedDocuments, selectAttachments, fetchDocumentTypes, addDocument, replaceDocument, changeDocumentStatusDeleted, changeDocumentStatusArchived, changeDocumentFilter, logout }
)(DocumentsContainer);
