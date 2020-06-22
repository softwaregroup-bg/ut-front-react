import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from './style.css';
import Icon from '../Icon';

class ToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    mouseOver() {
        this.setState({ hover: true });
    }

    mouseOut() {
        this.setState({ hover: false });
    }

    render() {
        let hoverClass = '';
        let stylesToUse = this.props.styles || style;

        if (this.state.hover) {
            hoverClass =
                <div className={stylesToUse.toolTipBox}>
                    {this.props.children}
                </div>;
        }

        return (
            <div className={style.toolTipWrap}>
                <Icon icon='infoToolTip' onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} className={style.iconWrapper} />
                {hoverClass}
            </div>
        );
    }
}

ToolTip.propTypes = {
    children: PropTypes.any,
    styles: PropTypes.any
};

ToolTip.defaultProps = {
    styles: undefined
};

export default ToolTip;
