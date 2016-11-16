const path = require('path');

module.exports = {
    title: 'UnderTree React Component Helper',
    sections: [
        {components: '../components/Accordion/index.js'},
        {components: '../components/AdvancedPagination/index.js'},
        {components: '../components/AttributesSection/index.js'},
        {components: '../components/Box/index.js'},
        {components: '../components/BusinessUnits/index.js'},
        {name: 'Button', content: 'docs/Button.md', components: '../components/Button/index.js'},
        {name: 'ButtonInput', components: '../components/Input/ButtonInput.js'},
        {name: 'DateInput', components: '../components/Input/DateInput.js'},
        {name: 'Dropdown', components: '../components/Input/Dropdown.js'},
        {name: 'MultiStateCheckbox', components: '../components/Input/MultiStateCheckbox.js'},
        {name: 'Radio', components: '../components/Input/Radio.js'},
        {name: 'TextArea', content: 'docs/TextArea.md', components: '../components/Input/TextArea.js'},
        {name: 'TextField', components: '../components/Input/TextField.js'},
        {name: 'TimePicker', components: '../components/Input/TimePicker.js'},
        {components: '../components/CollapsableContent/index.js'},
        {components: '../components/DataList/index.js'},
        {components: '../components/DataList/ValueRow/index.js'},
        {components: '../components/DataList/KeyValueRow/index.js'},
        {components: '../components/Date/index.js'},
        {components: '../components/DropdownSelect/index.js'},
        {components: '../components/FooterIcon/index.js'},
        {components: '../components/Icon/index.js'},
        {components: '../components/Image/index.js'},
        {components: '../components/InlineEditor/index.js'},
        {components: '../components/Menu/index.js'},
        {components: '../components/Search/index.js'},
        {components: '../components/SearchBox/index.js'},
        {components: '../components/SelectableSearch/index.js'},
        {components: '../components/Sidebar/index.js'},
        {components: '../components/SimpleGrid/index.js'},
        {components: '../components/TabSet/index.js'}
    ],
    updateWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, '../components');
        const helpers = path.resolve(__dirname, '../helpers.js');
        const validator = path.resolve(__dirname, '../validator');
        webpackConfig.module.loaders.push({
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0'],
                babelrc: false
            },
            test: /\.js?$/,
            include: [
                dir,
                helpers,
                validator
            ]
        }, {
            test: /\.css$/,
            include: [
                dir,
                helpers,
                validator
            ],
            loader: 'style!css?modules&importLoaders=1'
        }, {
            test: /\.(png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/i,
            include: [
                dir,
                helpers,
                validator
            ],
            loaders: ['file-loader']
        });
        return webpackConfig;
    }
};
