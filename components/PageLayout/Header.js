import PropTypes from 'prop-types';
import React from 'react';
import StandardButton from '../../components/StandardButton';
import { Link } from 'react-router-dom';

import style from './style.css';

class Header extends React.Component {
    static propTypes = {
        text: PropTypes.node.isRequired,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            href: PropTypes.string,
            onClick: PropTypes.func,
            permissions: PropTypes.array
        })),
        location: PropTypes.object,
        buttonsRaw: PropTypes.node,
        breadcrumbsRemoveSlashes: PropTypes.number
    }

    static defaultProps = {
        buttonsRaw: [],
        buttons: [],
        location: undefined,
        breadcrumbsRemoveSlashes: 1
    }

    static contextTypes = {
        checkPermission: PropTypes.func
    }

    render() {
        let { text, buttons, buttonsRaw } = this.props;

        return (
            <div className={style.headerWrapper}>
                <h1 className={style.heading}>
                    <div className={style.headingTextWrap}>{text}</div>
                </h1>
                <div className={style.buttonsWrap}>
                    <div className={style.buttonsContainer}>
                        {buttonsRaw.map((btn, i) => {
                            return (
                                <div key={i} className={style.buttonWrap}>{btn}</div>
                            );
                        })}
                        {buttons.map((btn, i) => {
                            let styleType = btn.styleType || 'secondaryDark';
                            if (btn.permissions && !this.context.checkPermission(btn.permissions)) {
                                return <div />;
                            }

                            if (btn.onClick) {
                                return (
                                    <div key={i} className={style.buttonWrap}>
                                        <StandardButton
                                            styleType={styleType}
                                            onClick={btn.onClick}
                                            disabled={btn.disabled === true}
                                            label={btn.text}
                                            href={btn.href} />
                                    </div>
                                );
                            } else {
                                return (
                                    <Link key={i} to={btn.href} className={style.buttonWrap}>
                                        <StandardButton
                                            styleType={styleType}
                                            disabled={btn.disabled === true}
                                            label={btn.text} />
                                    </Link>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
};

export default Header;
