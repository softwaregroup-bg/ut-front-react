import React, { PropTypes } from 'react';
import StandardButton from '../../components/StandardButton';
import { Link } from 'react-router';
import { getBreadcrumbsStringFromPathString } from './helpers';

import style from './style.css';

const Header = React.createClass({
    propTypes: {
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
    },
    getDefaultProps() {
        return {
            buttonsRaw: [],
            buttons: [],
            location: undefined,
            breadcrumbsRemoveSlashes: 1
        };
    },
    contextTypes: {
        checkPermission: PropTypes.func
    },
    render() {
        let { text, buttons, buttonsRaw, location, breadcrumbsRemoveSlashes } = this.props;
        let breadcrumbsString = '';
        if (location) breadcrumbsString = getBreadcrumbsStringFromPathString(location.pathname, breadcrumbsRemoveSlashes);

        return (
            <div className={style.headerWrapper}>
                <h1 className={style.heading}>
                    <div className={style.breadcrumbsWrap}>{breadcrumbsString}</div>
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
});

export default Header;
