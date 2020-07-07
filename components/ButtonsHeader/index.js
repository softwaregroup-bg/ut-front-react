import PropTypes from 'prop-types';
import React, { Component } from 'react';
import StandardButton from '../StandardButton';

import style from './style.css';

class ButtonsHeader extends Component {
    renderButton(label, onClick, disabled, isLeftOriented, key) {
        key = key || new Date().getTime();
        if (typeof disabled === 'undefined') {
            disabled = false;
        }
        if (typeof isLeftOriented === 'undefined') {
            isLeftOriented = true;
        }

        const wrapperClassName = isLeftOriented ? style.leftButtonsHeaderButton : style.rightButtonsHeaderButton;

        return (
            <div key={key} className={wrapperClassName}>
                <StandardButton label={label} onClick={onClick} disabled={disabled} styleType='secondaryDark' />
            </div>
        );
    }

    render() {
        const { config } = this.props;
        let leftButtons;
        let rightButtons;

        if (config.left && Array.isArray(config.left) && config.left.length > 0) {
            leftButtons = config.left.map((conf, index) => {
                return this.renderButton(conf.label, conf.onClick, conf.disabled, true, index);
            });
        }

        if (config.right && Array.isArray(config.right) && config.right.length > 0) {
            rightButtons = config.right.reverse().map((conf, index) => {
                return this.renderButton(conf.label, conf.onClick, conf.disabled, false, index);
            });
        }

        return (
            <div className={style.container}>
                <div className={style.leftContainer}>{leftButtons}</div>
                <div className={style.rightContainer}>{rightButtons}</div>
            </div>
        );
    }
}

ButtonsHeader.propTypes = {
    config: PropTypes.shape({
        left: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            disabled: PropTypes.bool
        })),
        right: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            disabled: PropTypes.bool
        }))
    }).isRequired
};

export default ButtonsHeader;
