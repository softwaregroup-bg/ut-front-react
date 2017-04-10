import {
    FETCH_DOCUMENTS,
    SELECT_ATTACHMENT,
    DELETE_DOCUMENT,
    UPDATE_PAGINATION,
    UPDATE_ORDER
} from './actionTypes';

export const fetchDocuments = (actorId, filters, identifier) => {
    let paramsFilters = filters ? filters.toJS() : {};
    if (paramsFilters.paging) {
        // we migh have some extra data such as totalPage, etc. (remove it)
        paramsFilters.paging = {
            pageSize: paramsFilters.paging.pageSize,
            pageNumber: paramsFilters.paging.pageNumber
        };
    }

    return {
        type: FETCH_DOCUMENTS,
        method: 'document.document.fetch',
        params: {
            actorId,
            ...paramsFilters
        },
        props: {
            identifier
        }
    };
};

export const selectAttachments = (attachments, isSelected, identifier) => ({
    type: SELECT_ATTACHMENT,
    props: {
        attachments,
        isSelected,
        identifier
    }
});

export const deleteAttachments = (documentIds, identifier) => {
    if (!Array.isArray(documentIds)) {
        documentIds = [documentIds];
    }

    return {
        type: DELETE_DOCUMENT,
        method: 'document.document.delete',
        params: {
            documentList: documentIds
        },
        props: {
            identifier
        }
    };
};

export const updatePagination = (pagination, identifier) => ({
    type: UPDATE_PAGINATION,
    props: {
        pagination,
        identifier
    }
});

export const updateOrder = (sortKey, sortDirection, identifier) => ({
    type: UPDATE_ORDER,
    props: {
        sortKey,
        sortDirection,
        identifier
    }
});
