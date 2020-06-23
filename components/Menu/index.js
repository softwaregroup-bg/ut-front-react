import PropTypes from 'prop-types';
import React from 'react';
import Sidebar from '../Sidebar';
import Grid from '@material-ui/core/Grid';

Menu.propTypes = {
    children: PropTypes.element,
    menuItems: Sidebar.propTypes.menuItems
};

export default function Menu({ children, menuItems }) {
    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Sidebar menuItems={menuItems} />
                </Grid>
            </Grid>
            <Grid>
                <Grid xs={2} />
                <Grid xs={10}>
                    {children}
                </Grid>
            </Grid>
        </div>
    );
}
