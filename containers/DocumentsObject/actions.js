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

export function initState(identifier, pathname) {
    return {
        type: INIT_DOCUMENTS_STATE,
        params: {
            identifier,
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

export const fetchArchivedDocuments = (objectId, objectType, identifier) => {
    return {
        type: FETCH_ARCHIVED_DOCUMENTS,
        method: 'document.archivedDocument.objectGet',
        params: {
            objectId,
            objectType
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

export function replaceDocument(identifier, oldDocumentObject, newDocumentObject) {
    return {
        type: REPLACE_DOCUMENT,
        props: {
            oldDocumentObject,
            newDocumentObject,
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
