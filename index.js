var path = require('path');
console.log(111111111111111 + path.resolve(require.resolve('ut-front-react'),'../', 'assets', 'css'))
console.log(222222222222222 + path.resolve(require.resolve('bootstrap'), '../..'))

module.exports = {
    start: function() {
        return this && this.registerRequestHandler && this.registerRequestHandler([{
            method: 'GET',
            path: '/static/assets/bootstrap/{p*}',
            config: {auth: false},
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
            config: {auth: false},
            handler: {
                directory: {
                    path: path.resolve(require.resolve('ut-front-react'),'../', 'components', 'MultiSelectBubble', 'assets'),
                    listing: false,
                    index: true,
                    lookupCompressed: true
                }
            }
        }]);
    }
};
