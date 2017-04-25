export function getFileExtension(filename) {
    if (!filename || !filename.lastIndexOf('.')) {
        return '';
    }
    return filename.substr(filename.lastIndexOf('.') + 1);
};
