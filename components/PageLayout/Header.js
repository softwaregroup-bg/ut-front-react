import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import StandardButton from '../../components/StandardButton';
import { Link } from 'react-router-dom';
import Text from '../Text';

import style from './style.css';

class Header extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        text: PropTypes.node.isRequired,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            href: PropTypes.string,
            onClick: PropTypes.func,
            permissions: PropTypes.array
        })),
        buttonsRaw: PropTypes.node
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
        const { text, buttons, buttonsRaw, classes } = this.props;

        return (
            <div className={classnames(style.headerWrapper, classes.paper)}>
                <h1 className={style.heading}>
                    <div className={style.headingTextWrap}><Text>{text}</Text></div>
                </h1>
                <div className={style.buttonsWrap}>
                    <div className={style.buttonsContainer}>
                        {buttonsRaw.map((btn, i) => {
                            return (
                                <div key={i} className={style.buttonWrap}>{btn}</div>
                            );
                        })}
                        {buttons.map((btn, i) => {
                            const styleType = btn.styleType || 'secondaryDark';
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
                                            href={btn.href}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <Link key={i} to={btn.href} className={style.buttonWrap}>
                                        <StandardButton
                                            styleType={styleType}
                                            disabled={btn.disabled === true}
                                            label={btn.text}
                                        />
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

export default withStyles(({palette}) => ({
    paper: {
        background: palette.background.paper
    }
}))(Header);
