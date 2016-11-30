var path = require('path');

module.exports = {
    start: function() {
        return this && this.registerRequestHandler && this.registerRequestHandler([{
            method: 'GET',
            path: '/static/assets/{p*}',
            config: {auth: false},
            handler: {
                directory: {
                    path: path.resolve(require.resolve('bootstrap'), '../..'),
                    listing: false,
                    index: true,
                    lookupCompressed: true
                }
            }
        }]);
    }
};
