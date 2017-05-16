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

export function initState(identifier, excludeIdsList, pathname) {
    return {
        type: INIT_DOCUMENTS_STATE,
        params: {
            identifier,
            excludeIdsList,
            pathname
        }
    };
}

export function resetDocumentState(identifier) {
    return {
        type: RESET_DOCUMENT_STATE,
        props: {
            identifier
        }
    };
}

export const fetchDocuments = (actorId, identifier) => {
    return {
        type: FETCH_DOCUMENTS,
        method: 'document.document.fetch',
        params: {
            actorId
        },
        props: {
            identifier
        }
    };
};

export const fetchArchivedDocuments = (actorId, identifier) => {
    return {
        type: FETCH_ARCHIVED_DOCUMENTS,
        method: 'document.document.fetch',
        params: {
            actorId
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

export const fetchDocumentTypes = (identifier, classParam) => ({
    type: FETCH_DOCUMENT_TYPES,
    method: 'document.documentTypeClass.fetch',
    params: {
        class: classParam
    },
    props: {
        identifier
    }
});

export function addDocument(identifier, newDocumentObject) {
    return {
        type: ADD_NEW_DOCUMENT,
        props: {
            newDocumentObject,
            identifier
        }
    };
}

export function replaceDocument(identifier, documentObject) {
    return {
        type: REPLACE_DOCUMENT,
        props: {
            documentObject,
            identifier
        }
    };
}

export function changeDocumentStatusDeleted(identifier, documentObject) {
    return {
        type: CHANGE_DOCUMENT_STATUS_DELETED,
        props: {
            documentObject,
            identifier
        }
    };
}

export function changeDocumentStatusArchived(identifier, documentObject) {
    return {
        type: CHANGE_DOCUMENT_STATUS_ARCHIVED,
        props: {
            documentObject,
            identifier
        }
    };
}

export function changeDocumentFilter(identifier, filter) {
    return {
        type: CHANGE_DOCUMENT_FILTER,
        props: {
            identifier,
            filter
        }
    };
}
