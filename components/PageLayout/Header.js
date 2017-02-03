import React, { PropTypes } from 'react';
import Button from '../../components/StandardButton';
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
        breadcrumbsRemoveSlashes: PropTypes.number
    },
    getDefaultProps() {
        return {
            buttons: [],
            location: undefined,
            breadcrumbsRemoveSlashes: 1
        };
    },
    contextTypes: {
        checkPermission: PropTypes.func
    },
    render() {
        let { text, buttons, location, breadcrumbsRemoveSlashes } = this.props;
        let breadcrumbsString = '';
        if (location) breadcrumbsString = getBreadcrumbsStringFromPathString(location.pathname, breadcrumbsRemoveSlashes);

        return (
            <div className={classnames('table', 'clearfix', style.headerWrapper)} style={{padding: '20px 16px', height: '71px'}}>
                <h1 className={classnames(style.heading, 'tableCell', 'vaMiddle')}>
                    <div className={style.breadcrumbsWrap}>{breadcrumbsString}</div>
                    {text}
                </h1>
                <div className={classnames('pull-xs-right', style.buttonsWrap)}>
                    {buttons.map((btn, i) => {
                        if (btn.permissions && !this.context.checkPermission(btn.permissions)) {
                            return <div />;
                        }

                        if (btn.onClick) {
                            return (
                                <div key={i} className={style.buttonWrap}>
                                    {(i > 0) && <span className='w20' />}
                                    <Button
                                      className={[style.headerButton]}
                                      disabledClassName={style.disabledHeaderButton}
                                      onClick={btn.onClick}
                                      disabled={btn.disabled === true}
                                      label={btn.text} />
                                </div>
                            );
                        } else {
                            return (
                                <Link key={i} to={btn.href} className={style.buttonWrap}>
                                    {(i > 0) && <span className='w20' />}
                                    <Button
                                      className={[style.headerButton]}
                                      disabledClassName={style.disabledHeaderButton}
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
