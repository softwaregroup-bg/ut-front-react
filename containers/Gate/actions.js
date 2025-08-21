export const CORE_ITEM_TRANSLATION_FETCH = Symbol('CORE_ITEM_TRANSLATION_FETCH');
export const CORE_LICENSE_CHECK = Symbol('CORE_LICENSE_CHECK');

export const fetchTranslations = (params) => ({
    type: CORE_ITEM_TRANSLATION_FETCH,
    method: 'core.translation.fetch',
    params: {
        ...params
    }
});

export const licenseCheck = (params = {}) => ({
    type: CORE_LICENSE_CHECK,
    method: 'core.license.check',
    suppressErrorWindow: true,
    params
});
