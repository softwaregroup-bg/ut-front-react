import React, { PropTypes, Component } from 'react';
import IPInput from '../Simple';
import Input from '../../Input';
import { textValidations } from '../../../validator/constants';
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
        let { inputWrapper, inputWrapClassName, keyProp, value, validators, labelClassName, boldLabel, inputType, errorMessageWrap } = this.props;
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
            <div className={inputType === 'ipRange' ? style.rangeWrap : style.textRangeWrap}>
                {inputType === 'ipRange' ? <div>
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
                </div> : inputType === 'textRange'
                    ? <div className={style.textWrapper}>
                        <div className={classnames(style.textRangeSeperator, inputWrapper)}>
                            <Input
                                value={value.from}
                                onChange={this.props.onChangeFrom}
                                isValid={isValidFrom}
                                readonly={this.props.readonlyFrom}
                                errorMessage={errorMessageFrom}
                                placeholder={this.props.placeholderFrom}
                                keyProp={keyProp.from}
                                validators={validators}
                                label={this.props.labelFrom}
                                labelClassName={labelClassName || style.labelWrapper}
                                inputWrapClassName={inputWrapClassName}
                                boldLabel={boldLabel}
                            />
                        </div>
                        <div className={classnames(style.textRangeSeperator, style.spaceWrap, inputWrapper)}>
                            <Input
                                value={value.to}
                                onChange={this.props.onChangeTo}
                                isValid={isValidTo}
                                readonly={this.props.readonlyTo}
                                errorMessage={errorMessageTo}
                                placeholder={this.props.placeholderTo}
                                keyProp={keyProp.to}
                                validators={validators}
                                label={this.props.labelTo}
                                labelClassName={labelClassName || style.toLabelWrapper}
                                inputWrapClassName={inputWrapClassName}
                                boldLabel={boldLabel}
                            />
                        </div>
                    </div> : ''}
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValidGeneral && <div className={classnames(style.errorMessage, errorMessageWrap)}>{errorMessageGeneral}</div>}</div>
            </div>
        );
    }
}

Range.propTypes = {
    keyProp: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    }),
    inputType: PropTypes.string,
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
    labelFrom: PropTypes.node,
    labelTo: PropTypes.node,
    errorMessageGeneral: PropTypes.string,
    inputWrapClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    inputWrapper: PropTypes.string,
    errorMessageWrap: PropTypes.string,
    value: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex]),
            values: PropTypes.any,
            errorMessage: PropTypes.string
        })
    ),
    boldLabel: PropTypes.bool
};

Range.defaultProps = {
    inputType: 'ipRange',
    isValidFrom: true,
    errorMessageFrom: '',
    placeholderFrom: '...',
    isValidTo: true,
    errorMessageTo: '',
    placeholderTo: '...',
    isValidGeneral: true,
    labelFrom: 'From',
    labelTo: 'To'
};

export default Range;
