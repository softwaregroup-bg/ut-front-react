import React, { PropTypes } from 'react';
import StandardButton from '../../components/StandardButton';
import { Link } from 'react-router';
import { getBreadcrumbsStringFromPathString } from './helpers';

import classnames from 'classnames';
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
            <div className={classnames('table', 'clearfix', style.headerWrapper)} style={{padding: '20px 16px', height: '71px'}}>
                <h1 className={classnames(style.heading, 'tableCell', 'vaMiddle')}>
                    <div className={style.breadcrumbsWrap}>{breadcrumbsString}</div>
                    {text}
                </h1>
                <div className={classnames('pull-xs-right', style.buttonsWrap)}>
                    {buttonsRaw.map((btn, i) => {
                        return (
                            <div key={i} className={style.buttonWrap}>{btn}</div>
                        );
                    })}
                    {buttons.map((btn, i) => {
                        if (btn.permissions && !this.context.checkPermission(btn.permissions)) {
                            return <div />;
                        }

                        if (btn.onClick) {
                            return (
                                <div key={i} className={style.buttonWrap}>
                                    {(i > 0) && <span className='w20' />}
                                    <StandardButton
                                      styleType='secondaryDark'
                                      onClick={btn.onClick}
                                      disabled={btn.disabled === true}
                                      label={btn.text}
                                      href={btn.href} />
                                </div>
                            );
                        } else {
                            return (
                                <Link key={i} to={btn.href} className={style.buttonWrap}>
                                    {(i > 0) && <span className='w20' />}
                                    <StandardButton
                                      styleType='secondaryDark'
                                      disabled={btn.disabled === true}
                                      label={btn.text} />
                                </Link>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }
});

export default Header;
