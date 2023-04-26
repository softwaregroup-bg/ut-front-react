export const CORE_ITEM_TRANSLATION_FETCH = Symbol('CORE_ITEM_TRANSLATION_FETCH');

export const fetchTranslations = (params) => ({
    type: CORE_ITEM_TRANSLATION_FETCH,
    method: 'core.translation.fetch',
    params: {
        ...params
    }
});
