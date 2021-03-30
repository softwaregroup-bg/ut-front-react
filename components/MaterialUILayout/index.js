import PropTypes from 'prop-types';
import React from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import DateUtils from '../DateUtils';

const theme = createMuiTheme({
    palette: {
        type: 'light'
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

const MaterialUILayout = ({children}) => (
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
