import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import * as muiStyles from '@material-ui/core/styles';
import DateUtils from '../DateUtils';
// the createMuiTheme function was renamed to createTheme at some point
const {MuiThemeProvider, createMuiTheme, createTheme = createMuiTheme} = muiStyles;

const MaterialUILayout = ({ children, utMethod }) => {
    debugger;
    const [theme, setTheme] = useState(createTheme())
    useEffect(async() => {
        const defaultColor = '#4096fd'
        let color;
        try {
            color = await utMethod('mainUI.muiThemeColor')({});
        } catch(error) {
            color = defaultColor
        }
        const theme = createTheme({
            palette: {
                primary: {
                    main: color || defaultColor
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
        setTheme(theme);
    }, []);

    return (
    <DateUtils>
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
    </DateUtils>
)};

MaterialUILayout.propTypes = {
    children: PropTypes.any
};

export default MaterialUILayout;
