import Immutable from 'immutable';
import {
    INIT_DOCUMENTS_STATE,
    FETCH_DOCUMENTS,
    FETCH_ARCHIVED_DOCUMENTS,
    SELECT_ATTACHMENT,
    FETCH_DOCUMENT_TYPES,
    ADD_NEW_DOCUMENT,
    REPLACE_DOCUMENT,
    CHANGE_DOCUMENT_STATUS_DELETED,
    CHANGE_DOCUMENT_STATUS_ARCHIVED,
    CHANGE_DOCUMENT_FILTER,
    RESET_DOCUMENT_STATE
} from './actionTypes';
import { REMOVE_TAB } from '../TabMenu/actionTypes';
import { methodRequestState, documentTmpUploadPrefix } from '../../constants';
import { parseFetchDocumentsResult, combineAttachments } from './helpers';

const getDaultAttachmentObject = function() {
    return {
        attachmentsList: [], // if you need all active attachments, subscribe to this object in mapstatetoprops
        deletedList: [], // if you need all deleted attachments, subscribe to this object in mapstatetoprops
        remoteDocuments: {
            requiresFetch: true,
            isLoading: false,
            data: []
        },
        changedDocuments: [],
        excludeIdsList: [],
        selected: null,
        pathname: null,
        selectedFilter: 'all',
        documentArchived: {
            requiresFetch: false,
            isLoading: false,
            data: []
        },
        documentTypes: {
            requiresFetch: true,
            isLoading: false,
            data: []
        }
    };
};

const defaultState = Immutable.fromJS({
});
const documents = (state = defaultState, action) => {
    const { type, props } = action;

    switch (type) {
        case INIT_DOCUMENTS_STATE:
            return state.setIn([action.params.identifier], Immutable.fromJS(getDaultAttachmentObject()))
                        .setIn([action.params.identifier, 'excludeIdsList'], Immutable.fromJS(action.params.excludeIdsList))
                        .setIn([action.params.identifier, 'pathname'], Immutable.fromJS(action.params.pathname));
        case REMOVE_TAB:
            let documentObjects = Object.keys(state.toJS());
            for (let i = 0; i < documentObjects.length; i++) {
                if (action.pathname === state.getIn([documentObjects[i], 'pathname'])) {
                    return state.delete(documentObjects[i]);
                }
            }
            return state;
        case RESET_DOCUMENT_STATE:
            return state.delete(action.props.identifier);
        case FETCH_DOCUMENTS:
            if (action.methodRequestState === methodRequestState.REQUESTED) {
                return state.setIn([props.identifier, 'remoteDocuments', 'isLoading'], Immutable.fromJS(true))
                            .setIn([props.identifier, 'remoteDocuments', 'requiresFetch'], Immutable.fromJS(false));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.document) {
                    const fetchDocumentsResult = parseFetchDocumentsResult(action.result.document);
                    let newState = state.setIn([props.identifier, 'remoteDocuments', 'data'], Immutable.fromJS(fetchDocumentsResult))
                                .setIn([props.identifier, 'selected'], Immutable.fromJS(null))
                                .setIn([props.identifier, 'remoteDocuments', 'isLoading'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'remoteDocuments', 'requiresFetch'], Immutable.fromJS(false));
                    newState = combineAttachments(newState.get(props.identifier));
                    return state.set(props.identifier, newState);
                }
            }
            return state;
        case FETCH_ARCHIVED_DOCUMENTS:
            if (action.methodRequestState === methodRequestState.REQUESTED) {
                return state.setIn([props.identifier, 'documentArchived', 'isLoading'], Immutable.fromJS(true))
                            .setIn([props.identifier, 'documentArchived', 'requiresFetch'], Immutable.fromJS(false));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.document) {
                    const fetchDocumentsResult = parseFetchDocumentsResult(action.result.document);
                    return state.setIn([props.identifier, 'documentArchived', 'data'], Immutable.fromJS(fetchDocumentsResult))
                                .setIn([props.identifier, 'selected'], Immutable.fromJS(null))
                                .setIn([props.identifier, 'documentArchived', 'isLoading'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'documentArchived', 'requiresFetch'], Immutable.fromJS(false));
                }
            }
            return state;
        case FETCH_DOCUMENT_TYPES:
            if (action.methodRequestState === methodRequestState.REQUESTED) {
                return state.setIn([props.identifier, 'documentTypes', 'requiresFetch'], Immutable.fromJS(false))
                            .setIn([props.identifier, 'documentTypes', 'isLoading'], Immutable.fromJS(true));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.documentTypeClass) {
                    let data = action.result.documentTypeClass.map((type) => {
                        return {
                            key: type.id,
                            name: type.description
                        };
                    });
                    return state.setIn([props.identifier, 'documentTypes', 'requiresFetch'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'documentTypes', 'isLoading'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'documentTypes', 'data'], Immutable.fromJS(data));
                } else {
                    return state.setIn([props.identifier, 'documentTypes', 'requiresFetch'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'documentTypes', 'isLoading'], Immutable.fromJS(false));
                }
            }
            return state;
        case SELECT_ATTACHMENT:
            if (props.isSelected) {
                return state.setIn([props.identifier, 'selected'], props.attachments);
            } else {
                return state.setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            }
        case ADD_NEW_DOCUMENT:
            let newDoc = action.props.newDocumentObject;
            newDoc.url = documentTmpUploadPrefix + newDoc.filename;
            let docs = state.getIn([action.props.identifier, 'changedDocuments']).reverse().push(Immutable.fromJS(newDoc));
            let newState = state.setIn([action.props.identifier, 'changedDocuments'], docs);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState)
                        .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
        case REPLACE_DOCUMENT:
            let replacedDocument;
            let newStatusId;
            let attachments;
            let doc = action.props.documentObject;
            doc.url = documentTmpUploadPrefix + doc.filename;
            if (doc.attachmentId) {
                // update a document that is on the server
                attachments = state.getIn([action.props.identifier, 'remoteDocuments', 'data']) || Immutable.fromJS([]);
                newStatusId = doc.statusId;
            } else {
                // update a document that is temporary (New)
                attachments = state.getIn([action.props.identifier, 'changedDocuments']) || Immutable.fromJS([]);
                newStatusId = 'new';
            }
            for (let i = 0; i < attachments.size; i++) {
                if (attachments.getIn([i, 'attachmentId']) === doc.attachmentId) {
                    replacedDocument = attachments.get(i);
                    break;
                }
            }
            // replace the new values
            replacedDocument = replacedDocument.set('filename', Immutable.fromJS(doc.filename))
                                            .set('extension', Immutable.fromJS(doc.extension))
                                            .set('url', Immutable.fromJS(doc.url))
                                            .set('contentType', Immutable.fromJS(doc.contentType))
                                            .set('statusId', Immutable.fromJS(newStatusId));
            docs = state.getIn([action.props.identifier, 'changedDocuments']).push(replacedDocument);
            newState = state.setIn([action.props.identifier, 'changedDocuments'], docs);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState)
                        .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
        case CHANGE_DOCUMENT_STATUS_DELETED:
            let statusId = action.props.documentObject.get('statusId');
            if (statusId) {
                let newState = state;
                switch (statusId) {
                    case 'new':
                        // remove the temp file from the list
                        let docs = state.getIn([action.props.identifier, 'changedDocuments']);
                        let fileIndex = -1;
                        for (let i = 0; i < docs.size; i++) {
                            if (docs.getIn([i, 'filename']) === action.props.documentObject.get('filename')) {
                                fileIndex = i;
                                break;
                            }
                        }
                        newState = state.deleteIn([action.props.identifier, 'changedDocuments', fileIndex])
                                    .setIn([action.props.identifier, 'selected'], null);
                        newState = combineAttachments(newState.get(action.props.identifier));
                        return state.set(action.props.identifier, newState);
                    case 'approved':
                    case 'active':
                    case 'archieved':
                        let deletedDoc = action.props.documentObject.set('statusId', 'deleted');
                        docs = state.getIn([action.props.identifier, 'changedDocuments']).push(deletedDoc);
                        newState = state.setIn([action.props.identifier, 'changedDocuments'], docs)
                                    .setIn([action.props.identifier, 'selected'], null);
                        newState = combineAttachments(newState.get(action.props.identifier));
                        return state.set(action.props.identifier, newState);
                }
            }
            return state;
        case CHANGE_DOCUMENT_STATUS_ARCHIVED:
            let archivedDoc = action.props.documentObject.set('statusId', 'archived');
            docs = state.getIn([action.props.identifier, 'changedDocuments']).push(archivedDoc);
            newState = state.setIn([action.props.identifier, 'changedDocuments'], docs)
                                    .setIn([action.props.identifier, 'selected'], null);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState);
        case CHANGE_DOCUMENT_FILTER:
            if (action.props.filter === 'all') {
                return state.setIn([action.props.identifier, 'selectedFilter'], Immutable.fromJS(action.props.filter))
                            .setIn([action.props.identifier, 'remoteDocuments', 'requiresFetch'], Immutable.fromJS(true))
                            .setIn([action.props.identifier, 'remoteDocuments', 'isLoading'], Immutable.fromJS(false))
                            .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            } else if (action.props.filter === 'archived') {
                return state.setIn([action.props.identifier, 'selectedFilter'], Immutable.fromJS(action.props.filter))
                            .setIn([action.props.identifier, 'documentArchived', 'requiresFetch'], Immutable.fromJS(true))
                            .setIn([action.props.identifier, 'documentArchived', 'isLoading'], Immutable.fromJS(false))
                            .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            }
            break;
        default:
            return state;
    }
    return state;
};

export default documents;
