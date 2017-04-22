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

    return config[contentType] || 'unkown';
};
