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
    CHANGE_DOCUMENT_STATUS_DELETED
} from './actionTypes';
import { methodRequestState, documentTmpUploadPrefix } from '../../constants';
import { parseFetchDocumentsResult } from './helpers';

const defaultPageSize = 25;
const getDaultAttachmentObject = function() {
    return {
        attachments: [],
        changedDocuments: [],
        selected: null,
        requiresFetch: true,
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
            return state.setIn([action.params.identifier], Immutable.fromJS(getDaultAttachmentObject));
        case FETCH_DOCUMENTS:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                if (action.result && action.result.document) {
                    const fetchDocumentsResult = parseFetchDocumentsResult(action.result.document);
                    let attachmentObject = getDaultAttachmentObject();
                    attachmentObject.attachments = fetchDocumentsResult;
                    attachmentObject.filters.paging = action.result.pagination[0];
                    attachmentObject.selected = null;
                    attachmentObject.requiresFetch = false;

                    state = state.set(props.identifier, Immutable.fromJS(attachmentObject));
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
            let docs = state.getIn([action.props.identifier, 'changedDocuments']).push(Immutable.fromJS(newDoc));
            return state.setIn([action.props.identifier, 'changedDocuments'], docs);
        case CHANGE_DOCUMENT_STATUS_DELETED:
            let statusId = action.props.documentObject.get('statusId');
            if (statusId) {
                switch (statusId) {
                    case 'New':
                        // remove the temp file from the list
                        let docs = state.getIn([action.props.identifier, 'changedDocuments']);
                        let fileIndex = -1;
                        for (let i = 0; i < docs.size; i++) {
                            if (docs.getIn([i, 'filename']) === action.props.documentObject.get('filename')) {
                                fileIndex = i;
                                break;
                            }
                        }
                        return state.deleteIn([action.props.identifier, 'changedDocuments', fileIndex])
                                    .setIn([action.props.identifier, 'selected'], null);
                    case 'Approved':
                    case 'Archieved':
                        let deletedDoc = action.props.documentObject.set('statusId', 'Deleted');
                        docs = state.getIn([action.props.identifier, 'changedDocuments']).push(deletedDoc);
                        return state.setIn([action.props.identifier, 'changedDocuments'], docs);
                }
            }
            return state;
        default:
            return state;
    }
};

export default documents;
