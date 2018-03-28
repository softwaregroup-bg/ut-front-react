const gridFields = [
    {name: 'Version #', key: '_version'},
    {name: 'Date and Time', key: 'auditDate'},
    {name: 'Changed by', key: 'userName'},
    {name: 'Event GUID', key: 'globalId'}
];

export const defaultState = {
    visitedHistoryPaths: {}, // used to remove history when it gets closed
    fields: gridFields,
    config: {
        objectName: null,
        objectId: null
    }
};

export const defaultHistoryState = {
    checkedHistories: [],
    histories: [],
    filterChanged: false,
    selectedHistory: null,
    eventDetails: {},
    showFilter: true,
    filters: {},
    filterErrors: {},
    errors: {},
    pagination: {
        pageSize: 25,
        pageNumber: 1,
        recordsTotal: 0,
        pagesTotal: 0
    }
};
