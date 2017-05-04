import Immutable from 'immutable';
import {
    INIT_DOCUMENTS_STATE,
    FETCH_DOCUMENTS,
    SELECT_ATTACHMENT,
    DELETE_DOCUMENT,
    UPDATE_PAGINATION,
    UPDATE_ORDER,
    FETCH_DOCUMENT_TYPES,
    ADD_NEW_DOCUMENT,
    REPLACE_DOCUMENT,
    CHANGE_DOCUMENT_STATUS_DELETED
} from './actionTypes';
import { REMOVE_TAB } from '../TabMenu/actionTypes';
import { methodRequestState, documentTmpUploadPrefix } from '../../constants';
import { parseFetchDocumentsResult, combineAttachments } from './helpers';

const defaultPageSize = 25;
const getDaultAttachmentObject = function() {
    return {
        attachmentsList: [], // if you need all active attachments, subscribe to this object in mapstatetoprops
        deletedList: [], // if you need all deleted attachments, subscribe to this object in mapstatetoprops
        attachments: [],
        remoteAttachments: [],
        changedDocuments: [],
        excludeIdsList: [],
        selected: null,
        requiresFetch: true,
        isLoading: false,
        pathname: null,
        filters: {
            paging: {
                pageSize: defaultPageSize,
                pageNumber: 1
            }
        },
        documentTypes: {
            requiresFetch: true,
            isLoading: false,
            data: []
        }
    };
};

const defaultState = Immutable.fromJS({
    // common: {
    //     filters: {
    //         paging: {
    //             pageSize: defaultPageSize,
    //             pageNumber: 1
    //         }
    //     }
    // }
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
        case FETCH_DOCUMENTS:
            if (action.methodRequestState === methodRequestState.requested) {
                return state.setIn([props.identifier, 'isLoading'], Immutable.fromJS(true))
                            .setIn([props.identifier, 'requiresFetch'], Immutable.fromJS(false));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.document) {
                    const fetchDocumentsResult = parseFetchDocumentsResult(action.result.document);
                    let newState = state.setIn([props.identifier, 'attachments'], Immutable.fromJS(fetchDocumentsResult))
                                .setIn([props.identifier, 'filters', 'paging'], Immutable.fromJS(action.result.pagination[0]))
                                .setIn([props.identifier, 'selected'], Immutable.fromJS(null))
                                .setIn([props.identifier, 'isLoading'], Immutable.fromJS(false))
                                .setIn([props.identifier, 'requiresFetch'], Immutable.fromJS(false));
                    newState = combineAttachments(newState.get(props.identifier));
                    return state.set(props.identifier, newState);
                }
            }
            return state;
        case FETCH_DOCUMENT_TYPES:
            if (action.methodRequestState === methodRequestState.REQUESTED) {
                return state.setIn([props.identifier, 'documentTypes', 'requiresFetch'], Immutable.fromJS(false))
                            .setIn([props.identifier, 'documentTypes', 'isLoading'], Immutable.fromJS(true));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.documentType) {
                    let data = action.result.documentType.map((type) => {
                        return {
                            key: type.id,
                            name: type.name
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
                return state.setIn([props.identifier, 'selected'], null);
            }
        case DELETE_DOCUMENT:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.setIn([props.identifier, 'requiresFetch'], true);
            }
            return state;
        case UPDATE_PAGINATION:
            let newPagination = Immutable.fromJS({
                pageSize: props.pagination.get('pageSize'),
                pageNumber: props.pagination.get('pageNumber')
            });
            return state
                .setIn([action.props.identifier, 'filters', 'paging'], newPagination)
                .setIn([action.props.identifier, 'requiresFetch'], true);
        case UPDATE_ORDER:
            if (props.sortDirection === 0) {
                return state
                    .deleteIn([action.props.identifier, 'filters', 'orderBy'])
                    .setIn([action.props.identifier, 'requiresFetch'], true);
            } else {
                let newOrder = Immutable.fromJS({
                    dir: props.sortDirection === 2 ? 'DESC' : 'ASC',
                    field: props.sortKey
                });
                return state
                    .setIn([action.props.identifier, 'filters', 'orderBy'], newOrder)
                    .setIn([action.props.identifier, 'requiresFetch'], true);
            }
        case ADD_NEW_DOCUMENT:
            let newDoc = action.props.newDocumentObject;
            newDoc.url = documentTmpUploadPrefix + newDoc.filename;
            let docs = state.getIn([action.props.identifier, 'changedDocuments']).reverse().push(Immutable.fromJS(newDoc));
            let newState = state.setIn([action.props.identifier, 'changedDocuments'], docs);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState);
        case REPLACE_DOCUMENT:
            let replacedDocument;
            let newStatusId;
            let attachments;
            let doc = action.props.documentObject;
            doc.url = documentTmpUploadPrefix + doc.filename;
            if (doc.attachmentId) {
                // update a document that is on the server
                attachments = state.getIn([action.props.identifier, 'attachments']) || Immutable.fromJS([]);
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
            return state.set(action.props.identifier, newState);
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
        default:
            return state;
    }
};

export default documents;
