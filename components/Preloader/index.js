import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog/Dialog';

const Preloader = ({open = true, message}) => {
    return (
      <Dialog open={open} title='Loading, please wait'>
        {message}
      </Dialog>
    );
};

Preloader.propTypes = {
    open: PropTypes.bool,
    message: PropTypes.node
};

export default Preloader;
