import Immutable from 'immutable';
import {
    INIT_DOCUMENTS_STATE,
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
import { methodRequestState, documentTmpUploadPrefix, documentPrefix } from '../../constants';
import { parseFetchDocumentsResult, combineAttachments, mergeDocumentsAndAttachments } from './helpers';

const getDefaultAttachmentObject = function() {
    return {
        attachmentsList: [], // if you need all active attachments, subscribe to this object in mapstatetoprops
        deletedList: [], // if you need all deleted attachments, subscribe to this object in mapstatetoprops
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
        },
        editedBy: null
    };
};

const defaultState = Immutable.fromJS({
});
const documents = (state = defaultState, action) => {
    const { type, props } = action;

    switch (type) {
        case INIT_DOCUMENTS_STATE:
            if (!state.get(action.params.identifier)) {
                return state.setIn([action.params.identifier], Immutable.fromJS(getDefaultAttachmentObject()))
                    .setIn([action.params.identifier, 'pathname'], Immutable.fromJS(action.params.pathname));
            }
            break;
        case REMOVE_TAB: {
            const documentObjects = Object.keys(state.toJS());
            for (let i = 0; i < documentObjects.length; i++) {
                if (action.pathname === state.getIn([documentObjects[i], 'pathname'])) {
                    return state.delete(documentObjects[i]);
                }
            }
            return state;
        }
        case RESET_DOCUMENT_STATE:
            return state.delete(action.props.identifier);
        case FETCH_ARCHIVED_DOCUMENTS:
            if (action.methodRequestState === methodRequestState.REQUESTED) {
                return state.setIn([props.identifier, 'documentArchived', 'isLoading'], Immutable.fromJS(true))
                    .setIn([props.identifier, 'documentArchived', 'requiresFetch'], Immutable.fromJS(false));
            } else if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.document) {
                    let fetchDocumentsResult = parseFetchDocumentsResult(action.result.document);
                    fetchDocumentsResult = mergeDocumentsAndAttachments(fetchDocumentsResult, action.result.attachment);
                    return state.setIn([props.identifier, 'documentArchived', 'data'], Immutable.fromJS(fetchDocumentsResult.localData.viewer))
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
                    const data = action.result.documentTypeClass.map((type) => {
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
                return state.setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            }
        case ADD_NEW_DOCUMENT: {
            const docs = state.getIn([action.props.identifier, 'changedDocuments']).reverse().push(Immutable.fromJS(action.props.newDocumentObject));
            let newState = state.setIn([action.props.identifier, 'changedDocuments'], docs);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState)
                .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
        }
        case REPLACE_DOCUMENT: {
            const doc = action.props.newDocumentObject;
            const newObject = action.props.oldDocumentObject;
			newObject.attachments[0] = newObject.attachments[0] || {};
            newObject.attachments[0].filename = doc.filename;
            newObject.attachments[0].extension = doc.extension;
            newObject.attachments[0].contentType = doc.contentType;
            newObject.attachments[0].url = doc.filename.indexOf('_file') > -1 ? documentTmpUploadPrefix + doc.filename : documentPrefix + doc.filename;
            newObject.attachments[0].isNew = true;
            newObject.statusId = 'replaced';
            const changedDocuments = state.getIn([props.identifier, 'changedDocuments']).toJS();
            const alreadyReplacedOnce = changedDocuments.findIndex((docObj) => {
                if (docObj.attachments[0].attachmentId && docObj.attachments[0].attachmentId === newObject.attachments[0].attachmentId) {
                    return true;
                } else if (docObj.attachments[0].attachmentUnapprovedId && docObj.attachments[0].attachmentUnapprovedId === newObject.attachments[0].attachmentUnapprovedId) {
                    return true;
                }
                return false;
            });
            if (alreadyReplacedOnce > -1) {
                changedDocuments[alreadyReplacedOnce] = newObject;
            } else {
                changedDocuments.push(newObject);
            }
            return state.setIn([props.identifier, 'changedDocuments'], Immutable.fromJS(changedDocuments))
                .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
        }
        case CHANGE_DOCUMENT_STATUS_DELETED: {
            const statusId = action.props.documentObject.get('statusId');
            if (statusId) {
                let newState = state;
                if (statusId === 'new' && !action.props.documentObject.get('attachmentId')) {
                    const _docs = state.getIn([action.props.identifier, 'changedDocuments']);
                    let fileIndex = -1;
                    for (let i = 0; i < _docs.size; i++) {
                        if (_docs.getIn([i, 'attachments', '0', 'filename']) === action.props.documentObject.getIn(['attachments', '0', 'filename'])) {
                            fileIndex = i;
                            break;
                        }
                    }
                    newState = state.deleteIn([action.props.identifier, 'changedDocuments', fileIndex])
                        .setIn([action.props.identifier, 'selected'], null);
                    newState = combineAttachments(newState.get(action.props.identifier));
                    return state.set(action.props.identifier, newState);
                } else {
                    const deletedDoc = action.props.documentObject.set('statusId', 'deleted');
                    const docs = state.getIn([action.props.identifier, 'changedDocuments']).push(deletedDoc);
                    newState = state.setIn([action.props.identifier, 'changedDocuments'], docs)
                        .setIn([action.props.identifier, 'selected'], null);
                    newState = combineAttachments(newState.get(action.props.identifier));
                    return state.set(action.props.identifier, newState);
                }
                // switch (statusId) {
                //     case 'new':
                //         // remove the temp file from the list
                //         let docs = state.getIn([action.props.identifier, 'changedDocuments']);
                //         let fileIndex = -1;
                //         for (let i = 0; i < docs.size; i++) {
                //             if (docs.getIn([i, 'filename']) === action.props.documentObject.get('filename')) {
                //                 fileIndex = i;
                //                 break;
                //             }
                //         }
                //         newState = state.deleteIn([action.props.identifier, 'changedDocuments', fileIndex])
                //                     .setIn([action.props.identifier, 'selected'], null);
                //         newState = combineAttachments(newState.get(action.props.identifier));
                //         return state.set(action.props.identifier, newState);
                //     case 'approved':
                //     case 'active':
                //     case 'pending':
                //     case 'archieved':
                //         let deletedDoc = action.props.documentObject.set('statusId', 'deleted');
                //         docs = state.getIn([action.props.identifier, 'changedDocuments']).push(deletedDoc);
                //         newState = state.setIn([action.props.identifier, 'changedDocuments'], docs)
                //                     .setIn([action.props.identifier, 'selected'], null);
                //         newState = combineAttachments(newState.get(action.props.identifier));
                //         return state.set(action.props.identifier, newState);
                // }
            }
            // return state;
            break;
        }
        case CHANGE_DOCUMENT_STATUS_ARCHIVED: {
            const archivedDoc = action.props.documentObject.set('statusId', 'archived');
            const docs = state.getIn([action.props.identifier, 'changedDocuments']).push(archivedDoc);
            let newState = state.setIn([action.props.identifier, 'changedDocuments'], docs)
                .setIn([action.props.identifier, 'selected'], null);
            newState = combineAttachments(newState.get(action.props.identifier));
            return state.set(action.props.identifier, newState);
        }
        case CHANGE_DOCUMENT_FILTER: {
            if (action.props.filter === 'all') {
                return state.setIn([action.props.identifier, 'selectedFilter'], Immutable.fromJS(action.props.filter))
                    .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            } else if (action.props.filter === 'archived') {
                return state.setIn([action.props.identifier, 'selectedFilter'], Immutable.fromJS(action.props.filter))
                    .setIn([action.props.identifier, 'documentArchived', 'requiresFetch'], Immutable.fromJS(true))
                    .setIn([action.props.identifier, 'documentArchived', 'isLoading'], Immutable.fromJS(false))
                    .setIn([props.identifier, 'selected'], Immutable.fromJS(null));
            }
            break;
        }
        default:
            return state;
    }
    return state;
};

export default documents;
