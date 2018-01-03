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
            <div className={this.props.inputType === 'ipRange' ? style.rangeWrap : style.textRangeWrap}>
                {this.props.inputType === 'ipRange' ? <div>
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
                </div> : this.props.inputType === 'textRange'
                ? <div className={style.textWrapper}>
                    <div className={classnames(style.textRangeSeperator, this.props.inputWrapper)}>
                        <Input
                          value={this.props.value.from}
                          onChange={this.props.onChangeFrom}
                          isValid={isValidFrom}
                          readonly={this.props.readonlyFrom}
                          errorMessage={errorMessageFrom}
                          placeholder={this.props.placeholderFrom}
                          keyProp={this.props.keyProp.from}
                          validators={this.props.validators}
                          label={this.props.labelFrom}
                          labelClassName={this.props.labelClassName || style.labelWrapper}
                          inputWrapClassName={this.props.inputWrapClassName}
                          boldLabel={this.props.boldLabel}
                        />
                    </div>
                    <div className={classnames(style.textRangeSeperator, style.spaceWrap, this.props.inputWrapper)}>
                        <Input
                          value={this.props.value.to}
                          onChange={this.props.onChangeTo}
                          isValid={isValidTo}
                          readonly={this.props.readonlyTo}
                          errorMessage={errorMessageTo}
                          placeholder={this.props.placeholderTo}
                          keyProp={this.props.keyProp.to}
                          validators={this.props.validators}
                          label={this.props.labelTo}
                          labelClassName={this.props.labelClassName || style.toLabelWrapper}
                          inputWrapClassName={this.props.inputWrapClassName}
                          boldLabel={this.props.boldLabel}
                        />
                    </div>
                </div> : ''}
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!this.props.isValidGeneral && <div className={style.errorMessage}>{errorMessageGeneral}</div>}</div>
            </div>
        );
    }
}

Range.propTypes = {
    inputType: PropTypes.string,
    keyProp: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    }),
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
