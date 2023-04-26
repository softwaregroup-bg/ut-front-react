import React from 'react';
import PropTypes from 'prop-types';
import defaultStyle from './style.css';
import classnames from 'classnames';
import Text from '../Text';

export default class Tab extends React.Component {
    render() {
        const style = this.props.cssStyle || defaultStyle;
        const {isActive, onClick, title, errorsCount} = this.props;
        let activeClassName;
        if (isActive) {
            activeClassName = style.selected;
        }
        const onClickHanlder = () => {
            onClick(this.props);
        };
        const errCount = errorsCount > 9 ? '9+' : errorsCount.toString();

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
                        {title && <Text>{title}</Text>}
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
