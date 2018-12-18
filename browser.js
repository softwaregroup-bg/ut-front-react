module.exports = () => function utFrontReact() {
    return {
        browser: () => [
            require('./ui').default
        ]
    };
};
