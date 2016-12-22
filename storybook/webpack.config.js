module.exports = {
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /(node_modules(\\|\/)(?!(impl|ut)-).)/, loader: 'babel', query: {presets: ['react', 'es2015-without-strict', 'stage-0']}},
            {test: /\.css$/, loaders: ['style', 'css?modules&importLoaders=1&localIdentName=[local]']},
            {test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]']},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
            {test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'}
        ]
    }
};
