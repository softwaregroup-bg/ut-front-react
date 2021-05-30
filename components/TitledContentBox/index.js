import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Text from '../Text';
import classnames from 'classnames';
import style from './style.css';

class TitledContentBox extends Component {
    render() {
        const {externalContentClasses, externalHeaderClasses, classes} = this.props;
        return (
            <div className={classnames(style.titledContentWrap, classes.paper, classes.border)}>

                <div className={classnames(style.headerWrap, externalHeaderClasses, classes.border)}>
                    <div className={this.props.centered ? style.titleCentered : style.title}>
                        <Text>{this.props.title}</Text>
                    </div>
                    <div className={style.rightWrap}>
                        {this.props.headRightWrap}
                    </div>
                </div>

                <div className={classnames(style.contentWrap, externalContentClasses)}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}

TitledContentBox.propTypes = {
    classes: PropTypes.object,
    centered: PropTypes.bool,
    title: PropTypes.any.isRequired,
    children: PropTypes.any,
    headRightWrap: PropTypes.any,
    externalContentClasses: PropTypes.string,
    externalHeaderClasses: PropTypes.string
};

export default withStyles(({palette}) => ({
    paper: {
        background: palette.background.paper,
        '& input': {
            color: palette.text.primary,
            borderColor: `${palette.divider}`,
            background: palette.background.paper
        },
        '& textarea': {
            color: palette.text.primary,
            borderColor: `${palette.divider}`,
            background: palette.background.paper
        }
    },
    border: {
        borderColor: `${palette.divider}`,
        '& div': {
            borderColor: `${palette.divider}`
        }
    }
}))(TitledContentBox);
