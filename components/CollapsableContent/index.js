import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import { Vertical } from '../Layout';
import ToolTip from '../ToolTip';
import Text from '../Text';

import style from './style.css';
import toolTipStyle from './tooltipstyles.css';
import collapableIcon from './images/collapsable.png';

export default class CollapsableContent extends Component {
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
            var newCollapsedState = !this.state.collapsed;
            this.setState({collapsed: newCollapsedState});
            this.props.onCollapse(newCollapsedState);
        }
    }

    getHeadingStyles() {
        var classes = classnames(style.heading);
        if (this.props.showCollapsibleButton && this.props.orientation === 'left' && !this.state.collapsed) {
            classes = classnames(classes, style.headingLeftArrow);
        } else if (this.props.showCollapsibleButton && this.props.orientation === 'right' && !this.state.collapsed) {
            classes = classnames(classes, style.headingRightArrow);
        }

        return classes;
    }

    getToggleArrowStyles() {
        var classes = classnames(style.collapseArrowWrap);
        if (this.props.orientation === 'left') {
            classes = classnames(classes, style.leftArrow);
        } else if (this.props.orientation === 'right') {
            classes = classnames(classes, style.rightArrow);
        }

        return classes;
    }

    getCollapsedArrowStyle() {
        var classes = classnames(style.collapsedArrowWrap);
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
                <div className={style.collapsableContentContainer} style={{...this.props.style, ...this.props.collapsedStyles}}>
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
            let currentStyles = this.props.showCollapsibleButton ? {paddingRight: '25px'} : {};
            return (
                <div className={style.collapsableContentContainer} style={{...this.props.style, ...this.props.visibleStyles}}>
                    <Vertical fixedComponent={<div className={this.getHeadingStyles()} style={currentStyles} onClick={this.toggle}>
                        <div className={style.textWrap}><Text>{this.props.heading}</Text></div>
                        {this.props.info !== '' && <div className={style.toolTipWrap}><ToolTip styles={toolTipStyle}>{this.props.info}</ToolTip></div>}
                        {this.props.showCollapsibleButton && <div className={this.getToggleArrowStyles()} />}
                    </div>
                    }>
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
