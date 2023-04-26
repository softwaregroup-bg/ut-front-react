import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import style from './style.css';

class ActionBar extends Component {
    renderButton(button, index) {
        const handleClick = () => {
            this.props.handleActionButtonClick(index);
        };

        return (
            <button disabled={button.isDisabled}
                className={classnames('button', 'btn', 'btn-primary')}
                onClick={handleClick}
            >
                {button.label}
            </button>
        );
    }

    render() {
        const { disablePrevBtn, onPrev, disableNextBtn, onNext } = this.props;
        const prevButtonStyles = disablePrevBtn ? '' : style.prevButtonWrapDisabled;
        const nextButtonStyles = disableNextBtn ? '' : style.nextButtonWrapDisabled;

        return (
            <div className={style.innerActionBarWrap}>

                <div className={classnames(style.buttonsWrap, style.prevButtonWrap, prevButtonStyles)}>
                    <button
                        className={style.navigationButton}
                        onClick={onPrev}
                        disabled={!disablePrevBtn}
                    >
                        Previous
                    </button>
                </div>

                <div className={classnames(style.buttonsWrap, style.nextButtonWrap, nextButtonStyles, style.pullRight)}>
                    <button
                        className={style.navigationButton}
                        onClick={onNext}
                        disabled={!disableNextBtn}
                    >
                        Next
                    </button>
                </div>

                <div className={classnames(style.buttonsWrap, style.pullRight)}>
                    {this.props.buttons.map((button, index) => (
                        <div key={index} className={style.actionButton}>
                            {this.renderButton(button, index)}
                        </div>
                    ))}
                </div>

            </div>
        );
    }
}

ActionBar.propTypes = {
    sourceMap: PropTypes.object,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            isDisabled: PropTypes.bool,
            onClick: PropTypes.func,
            performTablValidation: PropTypes.bool,
            performFullValidation: PropTypes.bool
        })
    ),
    disablePrevBtn: PropTypes.bool,
    disableNextBtn: PropTypes.bool,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    handleActionButtonClick: PropTypes.func
};

ActionBar.contextTypes = {
    assets: PropTypes.shape({
        arrowLeft: PropTypes.shape({
            arrowLeft: PropTypes.string
        }),
        arrowRight: PropTypes.shape({
            arrowRight: PropTypes.string
        })
    })
};

ActionBar.defaultProps = {
    sourceMap: {},
    buttons: [],
    disablePrevBtn: true,
    disableNextBtn: false,
    onPrev: () => {},
    onNext: () => {},
    handleActionButtonClick: () => {}
};

export default ActionBar;
