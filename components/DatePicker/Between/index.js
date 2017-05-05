import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import {formatIso} from 'material-ui/DatePicker/dateUtils';
import style from '../style.css';

const noop = () => {};

export default class DatePickerBetween extends Component {
    constructor(props) {
        super(props);
        this.getDateValues = this.getDateValues.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getContextStyles = this.getContextStyles.bind(this);
        this.state = {
            date: {
                from: undefined,
                to: undefined
            }
        };
    }

    componentWillMount() {
        let dateRange = this.getDateValues(this.props);

        dateRange && this.setState({date: dateRange});
    }

    componentWillReceiveProps(newProps) {
        let dateRange = this.getDateValues(newProps);
        dateRange && this.setState({date: dateRange});
    }

    getDateValues(props) {
        let dateRange;
        if (props.defaultValue) {
            dateRange = {
                from: props.defaultValue.from && new Date(props.defaultValue.from),
                to: props.defaultValue.to && new Date(props.defaultValue.to)
            };
        }

        return dateRange;
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

        let { locale, dateFormat, transformDate } = this.props;
        if (transformDate) {
            return transformDate(date, dateFormat, locale);
        }

        return formatIso(date);
    }
    handleAccept(ref) {
        let {date} = this.state;
        return (value) => {
            if ((date && date[ref] === value) || (!value && (!date || !date[ref]))) {
                return;
            }
            date[ref] = value;
            this.setState({
                date: date
            }, () => {
                if (this.props.onChange) {
                    let newDate = date[ref];
                    this.props.onChange({
                        key: ref,
                        value: (newDate && !isNaN(newDate.valueOf()))
                            ? (new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000))
                                .toISOString()
                                .substr(0, 10)
                            : null
                    });
                }
            });
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

        let {from, to} = this.state.date;

        let fromDate = from
            ? new Date(from)
            : new Date();
        let toDate = to
            ? new Date(to)
            : new Date();
        return (
            <div className={classnames(style.dpBoxWrap, this.getContextStyles('dpBoxWrap'), verticalClass)}>
                {this.props.masterLabel ? (<span className={classnames(style.masterLabel, this.getContextStyles('masteLabelStyle'))}>{this.props.masterLabel}</span>) : ''}
                <div className={classnames.apply(undefined, boxGroupStyles)}>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap)}>
                        {this.props.labelFrom ? (<span className={style.label}>{this.props.labelFrom}</span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesFrom)}>
                            <input value={from ? this.formatDate(fromDate) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('from')} />
                            <button onClick={this.handleOpen('from')} />
                        </div>
                    </div>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap, style.last)}>
                        {this.props.labelTo ? (<span className={style.label}>{this.props.labelTo}</span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesTo)}>
                            <input value={to ? this.formatDate(toDate) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('to')} />
                            <button onClick={this.handleOpen('to')} />
                        </div>
                    </div>
                </div>
                <DatePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={fromDate}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('from')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  ref='fromDialogWindow'
                />
                <DatePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={toDate}
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
    withVerticalClass: false,
    dateFormat: 'YYYY-MM-DD'
};
DatePickerBetween.propTypes = {
    defaultValue: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        to: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    }),
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
    dateFormat: PropTypes.string,
    transformDate: PropTypes.func,
    onChange: PropTypes.func
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
