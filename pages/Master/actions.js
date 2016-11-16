export const actions = {
    PREFETCH_WINDOW_CLOSE: Symbol('PREFETCH_WINDOW_CLOSE'),
    ERROR_WINDOW_TOGGLE: Symbol('ERROR_WINDOW_TOGGLE'),
    ERROR_WINDOW_CLOSE: Symbol('ERROR_WINDOW_CLOSE')
};

export const prefetchWindowClose = () => ({type: actions.PREFETCH_WINDOW_CLOSE});
export const errorWindowToggle = (params) => ({type: actions.ERROR_WINDOW_TOGGLE, message: params.message});
export const close = () => ({type: actions.ERROR_WINDOW_CLOSE});
