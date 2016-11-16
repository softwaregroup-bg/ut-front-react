import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ErrorWindow = ({open = true, message, close, title}) => {
    return (
      <Dialog
        open={open}
        title={title || 'ERROR'}
        actions={[
            <FlatButton label='Close' keyboardFocused onTouchTap={close} />
        ]}
      >
        {message}
      </Dialog>
    );
};

ErrorWindow.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    message: PropTypes.node,
    title: PropTypes.string
};

export default ErrorWindow;
