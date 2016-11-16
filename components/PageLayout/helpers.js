export function getBreadcrumbsStringFromPathString(pathString, numberOfSlashesToRemove = 1) {
    let result = pathString;

    for (var i = 0; i < numberOfSlashesToRemove; i += 1) {
        let lastIndexOfSlash = result.lastIndexOf('/');
        result = result.substring(0, lastIndexOfSlash);
    }

    return result;
}
