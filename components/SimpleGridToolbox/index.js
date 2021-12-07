import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Text from '../Text';

import style from './style.css';
import cssStandard from '../../assets/index.css';
export class Filters extends Component {
    render() {
        const classes = [(this.props.cssStandard && cssStandard.actionBarWrap), style.simpleToolbox];
        this.props.opened && classes.push(style.opened);
        this.props.opened && this.props.title.toLowerCase().includes('filters') && classes.push(style.buttonsOpened);
        return (
            <div className={classnames(classes)}>
                {this.props.title && <span className={this.props.isTitleLink ? style.link : style.label} onTouchTap={this.props.toggle}><Text>{this.props.title}</Text></span>}
                {this.props.contentWrapClassName
                    ? <div className={this.props.contentWrapClassName}>
                        {this.props.children}
                    </div>
                    : this.props.children}
            </div>
        );
    }
};
Filters.propTypes = {
    toggle: PropTypes.func,
    children: PropTypes.any.isRequired,
    contentWrapClassName: PropTypes.string,
    opened: PropTypes.bool.isRequired,
    title: PropTypes.any.isRequired,
    isTitleLink: PropTypes.bool.isRequired,
    cssStandard: PropTypes.bool
};
Filters.defaultProps = {
    title: '',
    isTitleLink: false,
    cssStandard: false
};

export default Filters;
