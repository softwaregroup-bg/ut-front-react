export const actionList = {
    CORE_ITEM_TRANSLATION_FETCH: Symbol('CORE_ITEM_TRANSLATION_FETCH')
};

export const fetchTranslations = (params) => {
    return {
        type: actionList.CORE_ITEM_TRANSLATION_FETCH,
        method: 'core.itemTranslation.fetch',
        params: params
    };
};
