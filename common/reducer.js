import { fromJS } from 'immutable';
import * as _helper from './helper';
export const actionTypes = {
    DOWNLOAD: Symbol('DOWNLOAD')
};
export const download = (params, methodName, filename) => ({
    type: actionTypes.DOWNLOAD,
    method: methodName,
    params,
    download: filename,
    $http: {blob: true}
});

export const utCommon = (state = fromJS({}), action) => {
    switch (action.type) {
        case actionTypes.DOWNLOAD:
            if (action.methodRequestState === 'finished' && action.result instanceof window.Blob) {
                _helper.download(action);
            }
            return state;
        default:
            return state;
    }
};
