import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

injectTapEventPlugin();

const MaterialUILayout = ({children}) => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        {children}
    </MuiThemeProvider>
);

MaterialUILayout.propTypes = {
    children: PropTypes.any
};

export default MaterialUILayout;
