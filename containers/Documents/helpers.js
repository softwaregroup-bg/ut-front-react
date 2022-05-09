import immutable from 'immutable';
import { documentPrefix, documentTmpUploadPrefix } from '../../constants';
import { mergeDocumentsWithChanged } from '../../components/Documents/helpers';
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
    const allAttachments = attachmentsList.toJS();
    const documents = [];
    const attachments = [];
    const actorDocument = [];
    let generatedDocumentId = -10;
    if (allAttachments.length > 0) {
        allAttachments.forEach((item) => {
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
                documentNumber: item.documentNumber,
                expirationDate: item.expirationDate || null,
                issueDate: item.issueDate || null,
                issuedBy: item.issuedBy || null,
                statusId: item.statusId,
                countryId: item.countryId,
                countryName: item.countryName || null
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
    const excludeIds = state.get('excludeIdsList').toJS();
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
    const deletedIds = [];
    tmpList.forEach((item) => {
        if (item.get('statusId') !== 'deleted') {
            if (excludeIds.length > 0) {
                const isInArray = excludeIds.find((excludeId) => {
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

export function mergeDocumentsAndAttachments(documents = [], attachments = [], documentsUnapproved = [], attachmentsUnapproved = []) {
    const sameMaker = [];
    let viewer = [];
    let unapproved = [];
    let matchType;
    if (documents.length > 0 && attachments.length > 0) {
        matchType = documents[0].documentUnapprovedId ? 'unapproved' : 'approved';
        if (matchType === 'unapproved') {
            // Documents are in pending status (unapproved)
            unapproved = insertAttachmentsInDocuments(documents, attachments, 'documentUnapprovedId');
        } else {
            // Documents are active (approved)
            viewer = insertAttachmentsInDocuments(documents, attachments, 'documentId');
        }
    }
    if (matchType !== 'unapproved' && documentsUnapproved.length > 0 && attachmentsUnapproved.length > 0) {
        unapproved = insertAttachmentsInDocuments(documentsUnapproved, attachmentsUnapproved, 'documentUnapprovedId');
    }
    return {
        remoteData: {
            documents,
            attachments,
            documentsUnapproved,
            attachmentsUnapproved
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
            if (document[factor] === attachment[factor].toString()) {
                const identifier = attachment.hash || attachment.filename;
                attachment.url = attachment.filename.indexOf('_file') > -1 ? documentTmpUploadPrefix + identifier : documentPrefix + identifier;
                document.attachments.push(attachment);
            }
        });
        return document;
    });
}

export function formatDocumentAndAttachmentsForSave(documents, actorId, unapprovedDocuments = {unapprovedDocuments: [], unapprovedAttachments: []}) {
    if (unapprovedDocuments.unapprovedDocuments.length) {
        return {
            documents: unapprovedDocuments.unapprovedDocuments,
            attachments: unapprovedDocuments.unapprovedAttachments,
            actorDocument: unapprovedDocuments.unapprovedDocuments.map((doc) => {
                return {
                    documentUnapprovedId: doc.documentUnapprovedId,
                    actorId
                };
            })
        };
    }

    const resultDocuments = [];
    const resultAttachments = [];
    const resultActorDocuments = [];
    let tmpDocId = -10;
    let tmpAttId = -10;
    let allDocuments = [];
    if (documents.documentsChanged.size > 0) {
        allDocuments = mergeDocumentsWithChanged(documents.documents.toJS(), documents.documentsChanged.toJS());
    } else {
        allDocuments = documents.documents.toJS();
    }
    allDocuments.forEach((doc) => {
        if (actorId) {
            actorId = parseInt(actorId);
        }
        const att = doc.attachments ? doc.attachments[0] : {};
        switch (doc.statusId) {
            case 'new': {
                tmpDocId--;
                tmpAttId--;
                const docObj = {
                    documentId: tmpDocId,
                    documentTypeId: doc.documentTypeId,
                    description: doc.description || null,
                    documentNumber: doc.documentNumber,
                    expirationDate: doc.expirationDate || null,
                    issueDate: doc.issueDate || null,
                    issuedBy: doc.issuedBy || null,
                    countryId: doc.countryId
                };
                const attObj = {
                    attachmentId: tmpAttId,
                    filename: att.filename,
                    hash: att.hash,
                    extension: att.extension,
                    contentType: att.contentType,
                    documentId: tmpDocId,
                    attachmentSizeId: 'original',
                    page: att.page
                };
                const actorDoc = {
                    actorId: actorId,
                    documentId: tmpDocId,
                    documentOrder: doc.documentOrder || 255
                };
                resultDocuments.push(docObj);
                resultAttachments.push(attObj);
                resultActorDocuments.push(actorDoc);
                break;
            }
            case 'approved':
            case 'archived':
            case 'deleted':
            case 'replaced':
            case 'pending': {
                let documentId = null;
                if (doc.documentId) {
                    documentId = doc.documentId.replace(/\*/g, '');
                    if (!documentId) {
                        documentId = null;
                    }
                }
                let statusId = doc.statusId;
                if (statusId === 'replaced') {
                    statusId = 'pending';
                }
                const docObj = {
                    documentId: documentId,
                    documentTypeId: doc.documentTypeId,
                    statusId: statusId,
                    description: doc.description || null,
                    documentNumber: doc.documentNumber,
                    expirationDate: doc.expirationDate || null,
                    issueDate: doc.issueDate || null,
                    issuedBy: doc.issuedBy || null,
                    countryId: doc.countryId
                };
                const attObj = {
                    attachmentId: att.attachmentId,
                    filename: att.filename,
                    hash: att.hash,
                    extension: att.extension,
                    contentType: att.contentType,
                    documentId: documentId,
                    attachmentSizeId: 'original',
                    page: att.page
                };
                const actorDoc = {
                    actorId: actorId,
                    documentId: documentId,
                    documentOrder: doc.documentOrder || 255
                };
                if (doc.documentUnapprovedId && att.attachmentUnapprovedId) {
                    docObj.documentUnapprovedId = actorDoc.documentUnapprovedId = doc.documentUnapprovedId.replace(/\*/g, '');
                    attObj.attachmentUnapprovedId = typeof att.attachmentUnapprovedId === 'string' && att.attachmentUnapprovedId.replace(/\*/g, '');
                    attObj.documentUnapprovedId = docObj.documentUnapprovedId;
                    if (docObj.documentUnapprovedId === '') {
                        docObj.documentUnapprovedId = null;
                    }
                    if (!attObj.attachmentUnapprovedId) {
                        attObj.attachmentUnapprovedId = null;
                    }
                }
                resultDocuments.push(docObj);
                resultAttachments.push(attObj);
                resultActorDocuments.push(actorDoc);
                break;
            }
        }
    });

    return {
        documents: resultDocuments,
        attachments: resultAttachments,
        actorDocument: resultActorDocuments
    };
}

// arrange documents, matched should be first and unmatxhed will next to it
export function arrangeDocuments(currentDocs, newDocs) {
    const arrangeCurrentDocs = []; const unmatchedCurrentDocs = [];
    const arrangeNewDocs = []; const unmatchedNewDocs = [];
    newDocs.map((doc) => {
        const matchedDoc = currentDocs.find((cDoc) => { return doc.documentId === cDoc.documentId && ['deleted', 'archived'].indexOf(doc.statusId) === -1; });
        if (matchedDoc) {
            arrangeNewDocs.push(doc);
            arrangeCurrentDocs.push(matchedDoc);
        } else unmatchedNewDocs.push(doc);
    });
    currentDocs.map((doc) => {
        if (!arrangeNewDocs.find((cDoc) => { return doc.documentId === cDoc.documentId; })) {
            unmatchedCurrentDocs.push(doc);
        }
    });
    return {
        arrangedCurrentDocs: arrangeCurrentDocs.concat(unmatchedCurrentDocs),
        arrangedNewDocs: arrangeNewDocs.concat(unmatchedNewDocs)
    };
}
