import React, {Component, PropTypes} from 'react';
import Text from '../Text';
import style from './style.css';

export class Filters extends Component {
    render() {
        var classes = [style.simpleToolbox];
        if (this.props.opened) {
            classes.push(style.opened);
        }
        return (
            <div className={classes.join(' ')}>
                <span className={this.props.isTitleLink ? style.link : style.label} onTouchTap={this.props.toggle}>
                    <Text>{this.props.title}</Text>
                </span>
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
