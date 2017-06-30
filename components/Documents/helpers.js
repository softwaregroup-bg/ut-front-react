import { validationTypes, textValidations, dropdownValidations } from '../../validator/constants.js';

// Listing
export const getListTableColumns = () => {
    return [
        {title: 'Group Name', name: 'documentType'},
        {title: 'Document Description', name: 'documentDescription'},
        {title: 'File Type', name: 'extension'},
        {title: 'Upload Date', name: 'createdDate'},
        {title: 'Status', name: 'statusId'}
    ];
};

export const mapContentTypeToExtension = (contentType) => {
    let config = {
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'application/msword': 'doc',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
    };

    return config[contentType] || 'unknown';
};

export function getDocumentTypeValidators() {
    return {
        key: ['fileType'],
        type: validationTypes.dropdown,
        rules: [
            {type: dropdownValidations.isRequired, errorMessage: 'Please select a file type.'}
        ]
    };
}

export function getDocumentDescriptionValidators() {
    return {
        key: ['description'],
        type: validationTypes.text,
        rules: [
            {type: textValidations.length, maxVal: 200, errorMessage: 'Description cannot exceeds 200 characters.'}
        ]
    };
}

export function mergeDocumentsWithChanged(documents, changedDocuments) {
    changedDocuments.forEach((changedDoc) => {
        switch (changedDoc.statusId) {
            case 'deleted':
            case 'replaced':
            case 'archived':
                for (let i = 0; i < documents.length; i++) {
                    if (documents[i].documentId === changedDoc.documentId) {
                        documents.splice(i, 1);
                        break;
                    }
                }
                break;
        }
    });
    return changedDocuments.concat(documents);
}
