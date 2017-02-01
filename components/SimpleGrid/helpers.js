export function getStorageColumns(moduleName) {
    if (!window.localStorage.hasOwnProperty(moduleName) || !Array.isArray(JSON.parse(window.localStorage.getItem(moduleName)))) {
        window.localStorage.setItem(moduleName, JSON.stringify([]));
    }

    return JSON.parse(window.localStorage.getItem(moduleName));
}

export function toggleColumnInStorage(moduleName, column) {
    let currentColumns = getStorageColumns(moduleName);
    let indexInColumns = currentColumns.indexOf(column);

    if (indexInColumns > -1) {
        currentColumns.splice(indexInColumns, 1);
    } else {
        currentColumns.push(column);
    }
    window.localStorage.setItem(moduleName, JSON.stringify(currentColumns));
}
