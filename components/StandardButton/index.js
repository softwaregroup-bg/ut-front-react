import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import buttonStyles from './styles.css';

export default class Button extends Component {
    constructor(props) {
        super(props);

        this.getClassName = this.getClassName.bind(this);
    }

    getClassName() {
        let { className } = this.props;

        return classnames(buttonStyles.standardBtn, Array.isArray(className) ? className.map(name => buttonStyles[name]) : buttonStyles[className]);
    }

    render() {
        let { type, label, onClick } = this.props;

        return (
            <button type={type} className={this.getClassName()} onClick={onClick} onTouchTap={onClick}>{label}</button>
        );
    }
}

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.oneOf([ PropTypes.string, PropTypes.Array ]),
    label: PropTypes.string,
    onClick: PropTypes.func
};

Button.defaultProps = {
    type: 'button',
    className: 'standardBtn',
    onClick: () => { }
};
