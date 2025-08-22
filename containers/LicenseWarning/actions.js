import { CORE_LICENSE_CHECK } from './actionTypes';

export const coreLicenseCheck = (params = {}) => ({
    type: CORE_LICENSE_CHECK,
    method: 'core.license.check',
    suppressErrorWindow: true,
    params
});
