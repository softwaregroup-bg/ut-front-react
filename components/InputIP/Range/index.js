import React, { PropTypes, Component } from 'react';
import IPInput from '../Simple';
import classnames from 'classnames';
import style from './style.css';

class Range extends Component {
    render() {
        let zeroHeightStyle = this.props.isValidGeneral ? style.hh : '';
        let isValidFrom = this.props.isValidFrom;
        let isValidTo = this.props.isValidTo;
        let errorMessageFrom = this.props.errorMessageFrom;
        let errorMessageTo = this.props.errorMessageTo;
        let errorMessageGeneral = this.props.errorMessageGeneral;
        if (isValidFrom && isValidTo && this.props.valueFrom !== '...' && this.props.valueTo !== '...') {
            if (this.props.isValidGeneral) {
                errorMessageFrom = '';
                errorMessageTo = '';
            } else {
                isValidFrom = false;
                isValidTo = false;
                errorMessageFrom = '';
                errorMessageTo = '';
            }
        } else {
            errorMessageGeneral = '';
        }
        return (
            <div className={style.rangeWrap}>
                <div>
                    <div className={style.wrapper}>
                        <IPInput
                          value={this.props.valueFrom}
                          onChange={this.props.onChangeFrom}
                          isValid={isValidFrom}
                          readonly={this.props.readonlyFrom}
                          errorMessage={errorMessageFrom}
                          placeholder={this.props.placeholderFrom}
                        />
                    </div>
                    <div className={classnames(style.wrapper, style.separator)}>
                        {' - '}
                    </div>
                    <div className={style.wrapper}>
                        <IPInput
                          value={this.props.valueTo}
                          onChange={this.props.onChangeTo}
                          isValid={isValidTo}
                          readonly={this.props.readonlyTo}
                          errorMessage={errorMessageTo}
                          placeholder={this.props.placeholderTo}
                        />
                    </div>
                </div>
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValidGeneral && <div className={style.errorMessage}>{errorMessageGeneral}</div>}</div>
            </div>
        );
    }
}

Range.propTypes = {
    valueFrom: PropTypes.string,
    onChangeFrom: PropTypes.func,
    isValidFrom: PropTypes.bool,
    readonlyFrom: PropTypes.bool,
    errorMessageFrom: PropTypes.string,
    placeholderFrom: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    valueTo: PropTypes.string,
    onChangeTo: PropTypes.func,
    isValidTo: PropTypes.bool,
    readonlyTo: PropTypes.bool,
    errorMessageTo: PropTypes.string,
    placeholderTo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    isValidGeneral: PropTypes.bool,
    errorMessageGeneral: PropTypes.string
};

Range.defaultProps = {
    isValidFrom: true,
    errorMessageFrom: '',
    placeholderFrom: '...',
    isValidTo: true,
    errorMessageTo: '',
    placeholderTo: '...',
    isValidGeneral: true
};

export default Range;
