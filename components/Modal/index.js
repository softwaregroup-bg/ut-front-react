import React from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';
import { Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Icon from '../Icon';
import style from './style.css';

const Modal = ({
    children,
    show = true,
    title,
    type = 'modal',
    showClose = true,
    showFooter = false,
    autoClose,
    buttons,
    footerMiddle,
    messageType,
    message,
    onClose,
    onClickOut,
    ...props
}) => {
    const showModalClass = show ? style.showDialog : style.hideDialog;
    let messageNode;
    let messageBodyClasses;
    let footer;
    const leftButton = (buttons && buttons.left) ? buttons.left : null;
    const rightButton = (buttons && buttons.right) ? buttons.right : null;
    let classes = classnames(style.overlay, showModalClass);
    const modalClickOut = (e) => {
        onClickOut && onClickOut();
    };
    if (onClickOut) {
        classes = classnames(classes, 'pointer');
    }
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
    if (showFooter) {
        footer = <Row className={classnames('row-reset', style.modalFooterWrapper)}>
            <Col xs='5' className='col-reset'>
                <div className='pull-xs-left clearfix' style={{padding: '12px 0px 12px 15px'}}>
                    {leftButton}
                </div>
            </Col>
            <Col xs='2' className={classnames('col-reset')}>
                {footerMiddle}
            </Col>
            <Col xs='5' className='col-reset'>
                <div className='pull-xs-right clearfix' style={{padding: '12px 15px 12px 0px'}}>
                    {rightButton}
                </div>
            </Col>
        </Row>;
    }
    switch (messageType) {
        case 'success':
            messageNode = <div>
                <div className='margin-top-30 margin-bottom-10'>
                    <Icon icon='success' className='margin-top-20' />
                </div>
                <div className='margin-bottom-30 margin-top-15' style={{marginRight: '30px', marginLeft: '30px'}}>
                    <span className='f28 f-green f-wordwrap'>{message}</span>
                </div>
            </div>;
            messageBodyClasses = classnames(style.messageBody);
            break;
        case 'error':
            messageNode = <div>
                <div className='margin-top-30 margin-bottom-10'>
                    <Icon icon='error' className='margin-top-20' />
                </div>
                <div className='margin-bottom-30 margin-top-15' style={{marginRight: '30px', marginLeft: '30px'}}>
                    <span className='f28 f-red f-wordwrap'>{message}</span>
                </div>
            </div>;
            messageBodyClasses = classnames(style.messageBody);
    }
    return (
        <div className={classes} onClick={modalClickOut}>
            <div onClick={stopPropagation} className={style.overlayDialog} {...props}>
                <Box fullWidth title={title} minHeight='100px' titleType='small' showClose={showClose} onClose={onClose}>
                    {messageNode}
                    <div className={messageBodyClasses} style={{minHeight: '100px'}}>{children}</div>
                    {footer}
                </Box>
            </div>
        </div>
    );
};

Modal.propTypes = {
    children: PropTypes.node,
    show: PropTypes.bool,
    showClose: PropTypes.bool,
    showFooter: PropTypes.bool,
    title: PropTypes.node,
    type: PropTypes.oneOf(['modal']), // future types can be 'info', 'alert', 'dialog'
    autoClose: PropTypes.shape({
        autoClose: PropTypes.bool.isRequired,
        time: PropTypes.number.isRequired
        // do we need callback function after the autoClose is completed
    }),
    buttons: PropTypes.shape({
        left: PropTypes.node,
        right: PropTypes.node // it's good to have validation for buttons such as: instanceOf(Button) , but error is triggered
    }),
    footerMiddle: PropTypes.node,
    messageType: PropTypes.oneOf(['success', 'error']), // other possible values in future might be 'info', 'warning' etc.
    message: PropTypes.node,
    onClose: PropTypes.func,
    onClickOut: PropTypes.func
};

export default Modal;
