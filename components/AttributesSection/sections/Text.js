import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from '../style.css';

class Text extends Component {
    renderAttributeValue(value) {
        let newValue = value;
        if (value && this.props.valueShouldBeMapped) {
            newValue = value.reduce((prev, curr) => {
                return prev.concat(curr.get(this.props.mapKey));
            }, []).join(', ') || 'N/A';
        }

        return newValue || <div className={style.italic}>Not set</div>;
    };

    render() {
        return (
            <div className={style.rowWrap}>
                <div className={style.title}>{this.props.title}</div>
                <div className={style.text}>{this.renderAttributeValue(this.props.value)}</div>
            </div>
        );
    }
}

Text.propTypes = {
    title: PropTypes.string,
    value: PropTypes.any,
    valueShouldBeMapped: PropTypes.bool,
    mapKey: PropTypes.string
};

Text.defaultProps = {
    title: undefined,
    value: undefined,
    valueShouldBeMapped: false,
    mapKey: undefined
};

export default Text;
