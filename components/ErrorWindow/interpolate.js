const paramsRegex = /\{([^}]*)\}/g;
export default (regExp => (msg, params = {}) => {
    return msg.replace(regExp, (placeholder, label) => {
        return typeof params[label] === 'undefined' ? `?${label}?` : params[label];
    });
})(paramsRegex);
