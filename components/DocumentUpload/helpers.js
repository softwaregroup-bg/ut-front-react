export function getFileExtension(filename) {
    if (!filename || !filename.lastIndexOf('.')) {
        return '';
    }
    return filename.substr(filename.lastIndexOf('.') + 1);
};

export function shrinkFilename(filename, maxChars = 15) {
    const ext = getFileExtension(filename);
    if (filename.length - (ext.length + 1) > maxChars) {
        return filename.substring(0, 15) + '....' + ext;
    } else {
        return filename;
    }
};

export const ERROR_STATUS_CODES = {
    request_entity_too_large: 413
};
