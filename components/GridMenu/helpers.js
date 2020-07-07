export function setGridStorage(name, fields) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(name, JSON.stringify({fields}));
};

export function getGridFields(name) {
    if (typeof window === 'undefined') return;
    const gstorage = JSON.parse(window.localStorage.getItem(name)) || {};
    return gstorage.fields;
}

export function prepareGridFields(name, initialFields) {
    const gfields = getGridFields(name) || initialFields;
    const hash = Object.create(null);
    initialFields.forEach(function(obj) {
        hash[obj.key] = obj;
    });
    gfields.forEach(obj => Object.assign(hash[obj.key], obj));
    setGridStorage(name, gfields);
    return gfields;
}

export function updateGridColumnStorage(name, col) {
    const gstorage = JSON.parse(window.localStorage.getItem(name)) || {};
    gstorage.fields = gstorage.fields && gstorage.fields.map(function(c) {
        if (c.key === col.key) {
            c.visible = col.visible;
        }
        return c;
    });
    setGridStorage(name, gstorage.fields);
}
