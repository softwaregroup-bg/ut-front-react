import React, { PropTypes, Component } from 'react';
import StandardButton from '../StandardButton';

import style from './style.css';

class ButtonsHeader extends Component {
    renderButton(label, onClick, isLeftOriented, key) {
        key = key || new Date().getTime();
        if (typeof isLeftOriented === 'undefined') {
            isLeftOriented = true;
        }

        let wrapperClassName = isLeftOriented ? style.leftButtonsHeaderButton : style.rightButtonsHeaderButton;

        return (
            <div key={key} className={wrapperClassName}>
                <StandardButton label={label} onClick={onClick} styleType='secondaryLight' />
            </div>
        );
    }

    render() {
        let { config } = this.props;
        let leftButtons;
        let rightButtons;

        if (config.left && Array.isArray(config.left) && config.left.length > 0) {
            leftButtons = config.left.map((conf, index) => {
                return this.renderButton(conf.label, conf.onClick, true, index);
            });
        }

        if (config.right && Array.isArray(config.right) && config.right.length > 0) {
            rightButtons = config.right.reverse().map((conf, index) => {
                return this.renderButton(conf.label, conf.onClick, false, index);
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
            onClick: PropTypes.func.isRequired
        })),
        right: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired
        }))
    }).isRequired
};

export default ButtonsHeader;
