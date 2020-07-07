import PropTypes from 'prop-types';
import React from 'react';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const DateUtils = ({children}) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {children}
    </MuiPickersUtilsProvider>
);

DateUtils.propTypes = {
    children: PropTypes.any
};

export default DateUtils;
