import React, { PropTypes, Component } from 'react';
import Input from './index';
import classnames from 'classnames';
import { textValidations } from '../../validator/constants';
import style from './style.css';

class Range extends Component {
    render() {
        let zeroHeightStyle = this.props.isValidGeneral ? style.hh : '';
        let isValidFrom = this.props.isValidFrom;
        let isValidTo = this.props.isValidTo;
        let errorMessageFrom = this.props.errorMessageFrom;
        let errorMessageTo = this.props.errorMessageTo;
        let errorMessageGeneral = this.props.errorMessageGeneral;
        let {labelClassName, inputWrapClassName, value, keyProp, boldLabel, inputWrapper} = this.props;
        if (isValidFrom && isValidTo && value.from !== '' && value.to !== '') {
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
                <div className={style.wrapper}>
                    <div className={classnames(style.seperator, inputWrapper)}>
                        <Input
                          value={value.from}
                          onChange={this.props.onChangeFrom}
                          isValid={isValidFrom}
                          readonly={this.props.readonlyFrom}
                          errorMessage={errorMessageFrom}
                          placeholder={this.props.placeholderFrom}
                          keyProp={keyProp.from}
                          validators={this.props.validators}
                          label={this.props.labelFrom}
                          labelClassName={labelClassName || style.labelWrapper}
                          inputWrapClassName={inputWrapClassName}
                          inputClas
                          boldLabel={boldLabel}
                        />
                    </div>
                    <div className={classnames(style.seperator, style.spaceWrap, inputWrapper)}>
                        <Input
                          value={value.to}
                          onChange={this.props.onChangeTo}
                          isValid={isValidTo}
                          readonly={this.props.readonlyTo}
                          errorMessage={errorMessageTo}
                          placeholder={this.props.placeholderTo}
                          keyProp={keyProp.to}
                          validators={this.props.validators}
                          label={this.props.labelTo}
                          labelClassName={labelClassName || style.toLabelWrapper}
                          inputWrapClassName={inputWrapClassName}
                          boldLabel={boldLabel}
                        />
                    </div>
                </div>
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValidGeneral && <div className={style.errorMessage}>{errorMessageGeneral}</div>}</div>
            </div>
        );
    }
}

Range.propTypes = {
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex]),
            values: PropTypes.any,
            errorMessage: PropTypes.string
        })
    ),
    value: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    keyProp: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    }),
    onChangeFrom: PropTypes.func,
    isValidFrom: PropTypes.bool,
    labelFrom: PropTypes.node,
    readonlyFrom: PropTypes.bool,
    errorMessageFrom: PropTypes.string,
    onClickFrom: PropTypes.func,
    onBlurFrom: PropTypes.func,
    placeholderFrom: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    onChangeTo: PropTypes.func,
    isValidTo: PropTypes.bool,
    labelTo: PropTypes.node,
    readonlyTo: PropTypes.bool,
    errorMessageTo: PropTypes.string,
    onClickTo: PropTypes.func,
    onBlurTo: PropTypes.func,
    boldLabel: PropTypes.bool,
    inputWrapClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    inputWrapper: PropTypes.string,
    placeholderTo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    isValidGeneral: PropTypes.bool,
    errorMessageGeneral: PropTypes.string
};

Range.defaultProps = {
    isValidFrom: true,
    validators: [],
    errorMessageFrom: '',
    placeholderFrom: '',
    isValidTo: true,
    errorMessageTo: '',
    placeholderTo: '',
    isValidGeneral: true,
    labelFrom: 'From',
    labelTo: 'To'
};

export default Range;
