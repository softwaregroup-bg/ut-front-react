var path = require('path');
var merge = require('lodash.merge');
var pkg = require(path.join(path.dirname(require.main.filename), 'package.json'));

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
        }, {
            method: 'GET',
            path: '/',
            config: {auth: false},
            handler: (request, reply) => {
                this.config['utfront.pack'](merge({}, this.config, {minifyJS: false, bundlingEnabled: false}))
                    .then(function(pack) {
                        reply(`
                            <!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <!-- Required meta tags always come first -->
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                                    <meta http-equiv="x-ua-compatible" content="ie=edge">
                                    <script type="text/javascript">
                                        global=window;
                                    </script>
                                    <title>UnderTree</title>

                                    <!-- Bootstrap CSS -->
                                    <link rel="stylesheet" href="/static/assets/css/bootstrap.min.css">
                                    ${pack.head}
                                </head>
                                <body class="ut5">
                                    ${pack.body}
                                </body>
                            </html>
                        `)
                        .header('ut-impl-version', pkg.version);
                        return;
                    })
                    .catch((e) => {
                        throw new Error(e);
                    });
            }
        }]);
    }
};
