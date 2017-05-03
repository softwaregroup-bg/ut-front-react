import { validationTypes, textValidations, dropdownValidations } from '../../validator/constants.js';
import immutable from 'immutable';

// Listing
export const getListTableColumns = () => {
    return [
        {name: 'Group Name', key: 'documentType'},
        {name: 'Description of participation', key: 'documentDescription'},
        {name: 'Type', key: 'extension'},
        {name: 'Upload Date', key: 'createdDate'},
        {name: 'Status', key: 'statusId'}
    ];
};

export const getListTdStyles = () => {
    return [
        { width: '250px' },
        { },
        { width: '100px' },
        { width: '150px' },
        { width: '150px' }
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

/*
 * combineAttachments params:
 * @remoteAttachments - the whole list of attachments that is fetched for editing
 * @changedAttachments - all the documents that have the appropriate status
 * @excludeIds - array of all the documents that must not be listed
*/
export function combineAttachments(remoteAttachments = immutable.List(), changedAttachments = immutable.List(), excludeIds = []) {
    let tmpList = immutable.List();
    changedAttachments = changedAttachments.reverse();
    changedAttachments.forEach((item) => {
        if (item.get('statusId') !== 'new') {
            if (remoteAttachments.size > 0) {
                for (let i = 0; i < remoteAttachments.size; i++) {
                    if (remoteAttachments.getIn([i, 'attachmentId']) === item.get('attachmentId')) {
                        tmpList = tmpList.push(mergeAttachments(remoteAttachments.get(i), item));
                        remoteAttachments = remoteAttachments.delete(i);
                        break;
                    }
                }
            }
        } else {
            tmpList = tmpList.push(item);
        }
    });
    tmpList = tmpList.concat(remoteAttachments);
    let result = immutable.List();
    if (excludeIds.length > 0) {
        tmpList.forEach((item) => {
            if (item.get('statusId') !== 'deleted') {
                let isInArray = excludeIds.find((excludeId) => {
                    return excludeId === item.get('attachmentId');
                });
                if (!isInArray) {
                    result = result.push(item);
                }
            }
            // else do nothing because we don't want to display the deleted documents
            // TODO: gather the ids of all deleted attachments
        });
    }
    return result;
}

function mergeAttachments(mainObj, overridesObj) {
    return mainObj.merge(overridesObj);
}
