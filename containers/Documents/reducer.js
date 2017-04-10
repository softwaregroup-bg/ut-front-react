import Immutable from 'immutable';
import { FETCH_DOCUMENTS, SELECT_ATTACHMENT, DELETE_DOCUMENT, UPDATE_PAGINATION, UPDATE_ORDER } from './actionTypes';
import { methodRequestState } from '../../constants';
import { parseFetchDocumentsResult } from './helpers';

const defaultPageSize = 25;
const getDaultAttachmentObject = function() {
    return {
        attachments: [],
        selected: null,
        requiresFetch: true,
        filters: {
            paging: {
                pageSize: defaultPageSize,
                pageNumber: 1
            }
        }
    };
};

const defaultState = Immutable.fromJS({
    common: {
        filters: {
            paging: {
                pageSize: defaultPageSize,
                pageNumber: 1
            }
        }
    }
});
const documents = (state = defaultState, action) => {
    const { type, props } = action;

    switch (type) {
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
        default:
            return state;
    }
};

export default documents;
