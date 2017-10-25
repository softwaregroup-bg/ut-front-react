import React, {Component, PropTypes} from 'react';
import style from './style.css';

export class Filters extends Component {
    render() {
        var classes = [style.simpleToolbox];
        this.props.opened && classes.push(style.opened);
        this.props.opened && this.props.title.toLowerCase().includes('filters') && classes.push(style.buttonsOpened);
        return (
            <div className={classes.join(' ')}>
                <span className={this.props.isTitleLink ? style.link : style.label} onTouchTap={this.props.toggle}>{this.props.title}</span>
                <div className={style.content}>
                    {this.props.children}
                </div>
            </div>
        );
    }
};
Filters.propTypes = {
    toggle: PropTypes.func,
    children: PropTypes.any.isRequired,
    opened: PropTypes.bool.isRequired,
    title: PropTypes.any.isRequired,
    isTitleLink: PropTypes.bool.isRequired
};
Filters.defaultProps = {
    isTitleLink: false
};

export default Filters;
