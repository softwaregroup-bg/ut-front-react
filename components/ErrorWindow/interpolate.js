const paramsRegex = /\{([^}]*)\}/g;
export default (msg, params = {}) => msg.replace(paramsRegex, (placeholder, label) => {
    return typeof params[label] === 'undefined' ? `?${label}?` : params[label];
});
