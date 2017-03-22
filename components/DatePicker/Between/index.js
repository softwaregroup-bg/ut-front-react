import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import {formatIso} from 'material-ui/DatePicker/dateUtils';
import style from '../style.css';

const noop = () => {};

export default class DatePickerBetween extends Component {
    constructor(props) {
        super(props);
        this.state = props.defaultValue;
        this.handleAccept = this.handleAccept.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getContextStyles = this.getContextStyles.bind(this);
    }
    componentWillReceiveProps(newProps) {
        this.setState(newProps.defaultValue);
    }
    handleOpen(ref) {
        return () => {
            this.refs[`${ref}DialogWindow`].show();
        };
    }
    formatDate(date) {
        if (!date || isNaN(date.valueOf())) {
            return '';
        }

        let { locale, dateFormat } = this.props;
        if (locale) {
            return date.toLocaleDateString(locale, dateFormat);
        }

        return formatIso(date);
    }
    handleAccept(ref) {
        return (date) => {
            if ((this.state && this.state[ref] && this.state[ref] === date) || (!date && (!this.state || !this.state[ref]))) {
                return;
            }
            this.setState({
                [ref]: date
            });
            if (this.props.onChange) {
                this.props.onChange({key: ref, value: date});
            }
        };
    }
    handleKeyPress(ref) {
        return () => {
            this.handleAccept(ref)(undefined);
        };
    }
    getContextStyles(className) {
        if (this.context.implementationStyle[className]) {
            return this.context.implementationStyle[className];
        }
        return null;
    }
    render() {
        let boxStylesFrom = [style.dp];
        let boxStylesTo = [style.dp];
        let boxGroupStyles = [style.dpBoxGroupWrap];
        let verticalClass = [];
        if (!this.props.labelFrom) {
            boxStylesFrom.push(style.dpNoLabel);
        }
        if (!this.props.labelTo) {
            boxStylesTo.push(style.dpNoLabel);
        }
        if (!this.props.masterLabel) {
            boxGroupStyles.push(style.dpNoMasterLabel);
        }
        if (this.getContextStyles('dpBoxGroupWrap')) {
            boxGroupStyles.push(this.getContextStyles('dpBoxGroupWrap'));
        }
        if (this.props.withVerticalClass) {
            verticalClass.push(style.verticalWrapper);
        }
        if (this.props.withVerticalClass && this.getContextStyles('dpBoxGroupWrapVertical')) {
            verticalClass.push(this.getContextStyles('dpBoxGroupWrapVertical'));
        }
        return (
            <div className={classnames(style.dpBoxWrap, this.getContextStyles('dpBoxWrap'), verticalClass)}>
                {this.props.masterLabel ? (<span className={classnames(style.masterLabel, this.getContextStyles('masteLabelStyle'))}>{this.props.masterLabel}</span>) : ''}
                <div className={classnames.apply(undefined, boxGroupStyles)}>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap)}>
                        {this.props.labelFrom ? (<span className={style.label}>{this.props.labelFrom}</span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesFrom)}>
                            <input value={this.state.from ? this.formatDate(this.state.from) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('from')} />
                            <button onClick={this.handleOpen('from')} />
                        </div>
                    </div>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap, style.last)}>
                        {this.props.labelTo ? (<span className={style.label}>{this.props.labelTo}</span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesTo)}>
                            <input value={this.state.to ? this.formatDate(this.state.to) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('to')} />
                            <button onClick={this.handleOpen('to')} />
                        </div>
                    </div>
                </div>
                <DatePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={this.state.from}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('from')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  ref='fromDialogWindow'
                />
                <DatePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={this.state.to}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('to')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  ref='toDialogWindow'
                />
            </div>
        );
    }
}

DatePickerBetween.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    withVerticalClass: false
};
DatePickerBetween.propTypes = {
    defaultValue: PropTypes.object,
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    withVerticalClass: PropTypes.bool,
    masterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelTo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    dateFormat: PropTypes.object,
    onChange: PropTypes.func
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
