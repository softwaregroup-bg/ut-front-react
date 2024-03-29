import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import ToolTip from '../ToolTip';
import Text from '../Text';

import classnames from 'classnames';
import style from './style.css';
import toolTipStyle from './tooltipstyles.css';
import collapableIcon from './images/collapsable.png';
import { Vertical } from '../Layout';

class CollapsableContent extends Component {
    constructor(props, context) {
        super(props, context);
        this.toggle = this.toggle.bind(this);
        this.state = {collapsed: this.props.isCollapsed};
        this.getHeadingStyles = this.getHeadingStyles.bind(this);
        this.getToggleArrowStyles = this.getToggleArrowStyles.bind(this);
        this.getCollapsedArrowStyle = this.getCollapsedArrowStyle.bind(this);
    }

    componentWillReceiveProps({isCollapsed}) {
        if (this.state.collapsed !== isCollapsed) {
            this.setState({collapsed: isCollapsed});
        }
    }

    toggle() {
        if (this.props.showCollapsibleButton) {
            const newCollapsedState = !this.state.collapsed;
            this.setState({collapsed: newCollapsedState});
            this.props.onCollapse(newCollapsedState);
        }
    }

    getHeadingStyles() {
        let classes = classnames(style.heading, this.props.classes.heading);
        if (this.props.showCollapsibleButton && this.props.orientation === 'left' && !this.state.collapsed) {
            classes = classnames(classes, style.headingLeftArrow);
        } else if (this.props.showCollapsibleButton && this.props.orientation === 'right' && !this.state.collapsed) {
            classes = classnames(classes, style.headingRightArrow);
        }

        return classes;
    }

    getToggleArrowStyles() {
        let classes = classnames(style.collapseArrowWrap);
        if (this.props.orientation === 'left') {
            classes = classnames(classes, style.leftArrow);
        } else if (this.props.orientation === 'right') {
            classes = classnames(classes, style.rightArrow);
        }

        return classes;
    }

    getCollapsedArrowStyle() {
        let classes = classnames(style.collapsedArrowWrap);
        if (this.props.orientation === 'left') {
            classes = classnames(classes, style.collapsedleftArrow);
        } else if (this.props.orientation === 'right') {
            classes = classnames(classes, style.collapsedrightArrow);
        }

        return classes;
    }

    render() {
        if (this.state.collapsed) {
            return (
                <div className={classnames(style.collapsableContentContainer, this.props.classes.paper)} style={{...this.props.style, ...this.props.collapsedStyles}}>
                    <div className={this.getHeadingStyles()} onClick={this.toggle}>
                        <div className={this.getCollapsedArrowStyle()}>
                            <img src={collapableIcon} />
                        </div>
                    </div>
                    <div style={{display: 'none'}}>
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            const currentStyles = this.props.showCollapsibleButton ? {paddingRight: '25px'} : {};
            return (
                <div className={classnames(style.collapsableContentContainer, this.props.classes.paper)} style={{...this.props.style, ...this.props.visibleStyles}}>
                    <Vertical fixedComponent={<div className={this.getHeadingStyles()} style={currentStyles} onClick={this.toggle}>
                        <div className={style.textWrap}><Text>{this.props.heading}</Text></div>
                        {this.props.info !== '' && <div className={style.toolTipWrap}><ToolTip styles={toolTipStyle}>{this.props.info}</ToolTip></div>}
                        {this.props.showCollapsibleButton && <div className={this.getToggleArrowStyles()} />}
                    </div>}
                    >
                        <div className={style.childWrap}>
                            {this.props.children}
                        </div>
                    </Vertical>
                </div>
            );
        }
    }
}

CollapsableContent.propTypes = {
    classes: PropTypes.object,
    orientation: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.any,
    visibleStyles: PropTypes.object,
    collapsedStyles: PropTypes.object,
    showCollapsibleButton: PropTypes.bool,
    heading: PropTypes.string,
    info: PropTypes.string,
    isCollapsed: PropTypes.bool,
    style: PropTypes.object,
    onCollapse: PropTypes.func
};

CollapsableContent.defaultProps = {
    heading: 'Heading',
    info: '',
    orientation: 'left',
    showCollapsibleButton: true,
    collapsedWidth: {},
    visibelStyles: {},
    style: {},
    isCollapsed: false,
    onCollapse: function() {}
};

export default withStyles(({palette}) => ({
    heading: {
        borderBottom: `1px solid ${palette.divider}`,
        background: palette.background.default
    },
    paper: {
        background: palette.background.paper
    }
}))(CollapsableContent);
