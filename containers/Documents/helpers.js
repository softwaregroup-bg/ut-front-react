import immutable from 'immutable';
import { documentPrefix, documentTmpUploadPrefix } from '../../constants';

/*
 * createIdentifier - creates an unique identifier for instance of documents tab container
 * params:
 * @moduleName - the module in which the instance is located
 * @sectionName - the logical module (e.g. users)
 * @mode - 'create' or 'edit'
 * @id - [optional] the id of the current item
 */
export function createIdentifier(moduleName, sectionName, mode, id) {
    let result = moduleName + '_' + sectionName + '_' + 'documents' + '_' + mode;
    if (id) {
        result += '_' + id;
    }
    return result;
};

/*
 * convertDocumentsForSave - transforms the attachmentsList array from the store to objects for create / edit
 * params:
 * @attachmentsList - array of attachment objects
 */

export function convertDocumentsForSave(attachmentsList, actorId) {
    let allAttachemnts = attachmentsList.toJS();
    let documents = [];
    let attachments = [];
    let actorDocument = [];
    let generatedDocumentId = -10;
    if (allAttachemnts.length > 0) {
        allAttachemnts.forEach((item) => {
            let docId;
            if (item.documentId) {
                docId = item.documentId;
            } else {
                docId = generatedDocumentId;
                generatedDocumentId--;
            }
            documents.push({
                actorId,
                documentId: docId,
                documentTypeId: item.documentTypeId,
                description: item.documentDescription || null,
                statusId: item.statusId
            });
            attachments.push({
                contentType: item.attachments[0].contentType,
                documentId: docId,
                attachmentSizeId: 'original',
                extension: item.attachments[0].extension
            });
            if (item.attachmentId) {
                attachments[(attachments.length - 1)].attachmentId = item.attachmentId;
            }
            if ((item.statusId === 'new' && !item.attachmentId) || item.statusId === 'pending') {
                attachments[(attachments.length - 1)].filename = item.filename;
            }
            actorDocument.push({
                actorId,
                documentId: docId,
                documentOrder: 255
            });
        });
    }
    return {
        document: documents,
        attachment: attachments,
        actorDocument: actorDocument
    };
};

export const parseFetchDocumentsResult = (documents) => {
    return documents.map((doc) => {
        return {
            url: documentPrefix + doc.filename,
            ...doc
        };
    });
};

/*
 * combineAttachments params:
 * @remoteAttachments - the whole list of attachments that is fetched for editing
 * @changedAttachments - all the documents that have the appropriate status
 * @excludeIds - array of all the documents that must not be listed
*/
export function combineAttachments(state) {
    let remoteAttachments = state.getIn(['remoteDocuments', 'data']) || immutable.List();
    let changedAttachments = state.get('changedDocuments') || immutable.List();
    let excludeIds = state.get('excludeIdsList').toJS();
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
    let deletedIds = [];
    tmpList.forEach((item) => {
        if (item.get('statusId') !== 'deleted') {
            if (excludeIds.length > 0) {
                let isInArray = excludeIds.find((excludeId) => {
                    return excludeId === item.get('attachmentId');
                });
                if (!isInArray) {
                    result = result.push(item);
                }
            } else {
                result = result.push(item);
            }
        } else {
            deletedIds.push(item.get('attachmentId'));
            // do nothing else because we don't want to display the deleted documents
        }
    });
    return state.set('attachmentsList', immutable.fromJS(result))
                .set('deletedList', immutable.fromJS(deletedIds));
}

function mergeAttachments(mainObj, overridesObj) {
    return mainObj.merge(overridesObj);
}

export function mergeDocumentsAndAttachments(documents = [], attachments = [], documentsUnapproved = [], attachemntsUnapproved = []) {
    let sameMaker = [];
    let viewer = [];
    let unapproved = [];
    if (documents.length > 0 && attachments.length > 0) {
        let matchType = documents[0].documentUnapprovedId ? 'unapproved' : 'approved';
        if (matchType === 'unapproved') {
            // Documents are in pending status (unapproved)
            viewer = insertAttachmentsInDocuments(documents, attachments, 'documentUnapprovedId');
        } else {
            // Documents are active (approved)
            viewer = insertAttachmentsInDocuments(documents, attachments, 'documentId');
        }
    }
    if (documentsUnapproved.length > 0 && attachemntsUnapproved.length > 0) {
        unapproved = insertAttachmentsInDocuments(documentsUnapproved, attachemntsUnapproved, 'documentUnapprovedId');
    }
    return {
        remoteData: {
            documents,
            attachments,
            documentsUnapproved,
            attachemntsUnapproved
        },
        localData: {
            sameMaker,
            viewer,
            unapproved
        }
    };
}

function insertAttachmentsInDocuments(documents = [], attachments = [], factor) {
    return documents.map((document) => {
        document.attachments = [];
        attachments.forEach((attachment) => {
            if (attachment[factor] === document[factor]) {
                attachment.url = attachment.isNew ? documentTmpUploadPrefix + attachment.filename : documentPrefix + attachment.filename;
                document.attachments.push(attachment);
            }
        });
        return document;
    });
}
