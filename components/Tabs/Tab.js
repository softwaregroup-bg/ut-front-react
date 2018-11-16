import React, { PropTypes } from 'react';
import classnames from 'classnames';

import Txt from '../Txt';
import defaultStyle from './style.css';

export default class Tab extends React.Component {
    render() {
        let style = this.props.cssStyle || defaultStyle;
        let {isActive, onClick, title, errorsCount} = this.props;
        let activeClassName;
        if (isActive) {
            activeClassName = style.selected;
        }
        let onClickHanlder = () => {
            onClick(this.props);
        };
        let errCount = errorsCount > 9 ? '9+' : errorsCount.toString();

        return (
            <li className={style.tabItem}>
                {
                    errorsCount > 0 &&
                    <div className={style.errorCountBox}>
                        <div className={style.innerErrorCountBox}>{errCount}</div>
                    </div>
                }
                <div className={classnames(style.tabMenuWrap, activeClassName)} onClick={onClickHanlder}>
                    <div className={style.tabMenu}>
                        <Txt>{title}</Txt>
                    </div>
                </div>
            </li>
        );
    }
}

Tab.propTypes = {
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    errorsCount: PropTypes.number,
    onClick: PropTypes.func,
    cssStyle: PropTypes.any
};

Tab.defaultProps = {
    isActive: false,
    errorsCount: 0,
    onClick: () => {},
    cssStyle: false
};
