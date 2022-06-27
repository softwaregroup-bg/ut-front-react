const path = require('path');

module.exports = () => function utFrontReact() {
    return {
        gateway: () => [
            function http() {
                return {
                    start: function() {
                        const handlers = [{
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
                        }];
                        try {
                            handlers.push({
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
                            });
                        } catch (e) {
                            // bootstrap is optional
                        }
                        return this && this.registerRequestHandler && this.registerRequestHandler(handlers);
                    }
                };
            }
        ]
    };
};
