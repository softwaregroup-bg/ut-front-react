import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class TextField extends Component {
    render() {
        const {classes, ...props} = this.props;
        if (this.props.label) {
            return (
                <div className={style.outerWrap}>
                    <div className={style.labelWrap}>
                        {this.props.label}
                    </div>
                    <div className={style.inputWrap}>
                        <input ref={(c) => { this.input = c; }} className={classnames(style.input, classes.border)} {...props} />
                    </div>
                </div>
            );
        } else {
            return <input ref={(c) => { this.input = c; }} className={classnames(style.input, classes.border)} {...props} />;
        }
    }
}

TextField.propTypes = {
    classes: PropTypes.object,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value: PropTypes.string
};

export default withStyles(({palette}) => ({
    border: {
        borderColor: palette.divider
    }
}))(TextField);
