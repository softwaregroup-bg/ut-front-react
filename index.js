var path = require('path');

module.exports = {
    start: function() {
        return this && this.registerRequestHandler && this.registerRequestHandler([{
            method: 'GET',
            path: '/static/assets/bootstrap/{p*}',
            options: {auth: false},
            handler: {
                directory: {
                    path: path.resolve(require.resolve('bootstrap'), '../..'),
                    listing: false,
                    index: true,
                    lookupCompressed: true
                }
            }
        },
        {
            method: 'GET',
            path: '/static/assets/react-select/{p*}',
            options: {auth: false},
            handler: {
                directory: {
                    path: path.join(__dirname, 'components/MultiSelectBubble/assets'),
                    listing: false,
                    index: true,
                    lookupCompressed: true
                }
            }
        }]);
    }
};
