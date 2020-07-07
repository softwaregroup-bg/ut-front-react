import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import style from '../style.css';

class LinkButton extends Component {
    render() {
        if (this.props.url) {
            return (
                <div className={style.rowWrap}>
                    <Link to={this.props.url} className={style.link}>{this.props.text}</Link>
                </div>
            );
        } else {
            return (
                <div className={style.rowWrap}>
                    <a className={style.link} onClick={this.props.onClick}>
                        {this.props.text}
                    </a>
                </div>
            );
        }
    }
}

LinkButton.propTypes = {
    url: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func
};

LinkButton.defaultProps = {
    url: undefined,
    text: 'View full info',
    onClick: () => {}
};

export default LinkButton;
