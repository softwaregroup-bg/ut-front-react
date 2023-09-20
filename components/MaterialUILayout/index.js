import PropTypes from 'prop-types';
import React from 'react';
import * as muiStyles from '@material-ui/core/styles';
import DateUtils from '../DateUtils';
// the createMuiTheme function was renamed to createTheme at some point
const {MuiThemeProvider, createMuiTheme, createTheme = createMuiTheme} = muiStyles;

const theme = createTheme({
    palette: {
        primary: {
            main: '#f68932'
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    lineHeight: 1.1
                }
            }
        }
    }
});

const MaterialUILayout = ({ children }) => (
    <DateUtils>
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    </DateUtils>
);

MaterialUILayout.propTypes = {
    children: PropTypes.any
};

export default MaterialUILayout;
