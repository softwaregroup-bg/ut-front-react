import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog/Dialog';

const Preloader = ({open = true, message}) => {
    return (
        <Dialog open={open} title='Loading, please wait' style={{zIndex: 9998}}>
            {message}
        </Dialog>
    );
};

Preloader.propTypes = {
    open: PropTypes.bool,
    message: PropTypes.node
};

export default Preloader;
