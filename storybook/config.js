import { configure } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import style from './../assets/index.css';
// import index from './../../ut-user/ui/assets/react/index.css';
// import style from './../assets/index.css';
import './styles.css';

function loadStories() {
    // Components
    require('./components/Accordion');
    require('./components/AdvancedPagination');
    require('./components/AttributesSection');
    require('./components/Box');
    require('./components/BusinessUnits');
    require('./components/BusinessUnitsTree');
    require('./components/Button');
    require('./components/CollapsableContent');
    require('./components/ConfirmDialog');
    require('./components/Date');
    require('./components/DatePicker');
    require('./components/FooterIcon');
    require('./components/Glyphicons');
    require('./components/Grid');
    require('./components/GridToolBox');
    require('./components/Icon');
    require('./components/Image');
    require('./components/InlineEditor');
    require('./components/Input');
    // require('./components/Login'); // Login is not used.
    require('./components/MaterialUILayout');
    require('./components/Number');
    require('./components/PageLayout');
    require('./components/Preloader');
    require('./components/Search');
    require('./components/SearchBox');
    require('./components/SimpleGrid');
    require('./components/TabMenu');
    require('./components/Tabs');
    require('./components/Text');
    require('./components/TimePicker');
    require('./components/TitledContentBox');

    // Pages
}

configure(loadStories, module);

// require('./components/CollapsableContent');
// require('./components/SelectableSearch');
