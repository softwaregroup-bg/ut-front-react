import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from './style.css';
import classnames from 'classnames';

class Container extends Component {
    render() {
        const styles = {
            borderTop: this.props.bordered ? '' : 'none'
        };
        return (
            <div id={style.mainContentWrap} style={styles}>
                <div className={classnames(style.h100pr, style.w100pr)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Container.propTypes = {
    children: PropTypes.any,
    bordered: PropTypes.bool
};

Container.defaultProps = {
    bordered: true
};

export default Container;
