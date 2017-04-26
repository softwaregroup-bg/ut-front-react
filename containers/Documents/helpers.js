import { documentPrefix } from '../../constants';

export const parseFetchDocumentsResult = (documents) => {
    return documents.map((doc) => {
        return {
            url: documentPrefix + doc.filename,
            ...doc
        };
    });
};
