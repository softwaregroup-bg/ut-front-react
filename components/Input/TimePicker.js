import React, { PropTypes, Component } from 'react';
import Dropdown from './Dropdown';
import { tpHours, tpMinuts } from './constants';
import style from './style.css';

/**
 * Timepicker contains two dropdows: one for hours, one for minutes.
 *  - When user first select hours the minutes are automatically set to 00.
 *  - When user first select minutes the hours are automatically set to 08.
 *
 *  The timepicker on change will return js datetime object.
 */

const defaultMinutes = 0;
const defaultHours = 8;

class TimePicker extends Component {
    constructor(props) {
        super(props);
        const initialDate = props.value;
        this.state = {
            value: props.value || undefined,
            userSelectedHours: initialDate ? this.formatHours(initialDate) : undefined,
            userSelectedMinutes: initialDate ? this.formatMinutes(initialDate) : undefined
        };
        this.getTimePicker = this.getTimePicker.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    formatHours(time) {
        return ('0' + time.getHours()).slice(-2);
    }

    formatMinutes(time) {
        return ('0' + time.getMinutes()).slice(-2);
    }

    componentWillReceiveProps({value}) {
        const newValue = value || undefined;
        this.setState({
            value: newValue,
            userSelectedHours: newValue ? this.formatHours(newValue) : undefined,
            userSelectedMinutes: newValue ? this.formatMinutes(newValue) : undefined
        });
    }

    handleChange(value) {
        const { keyProp, onChange } = this.props;
        const objectToPassOnChange = {key: keyProp, value: value, prevValue: this.state.value};
        onChange(objectToPassOnChange);
    }

    getTimePicker() {
        const initialDate = this.state.value;
        const valueHour = this.state.userSelectedHours;
        const valueMin = this.state.userSelectedMinutes;

        const handleHoursChange = (e) => {
            const selectedHour = e.value;
            const currentDate = initialDate || new Date();
            currentDate.setHours(selectedHour);
            if (this.state.userSelectedMinutes) {
                currentDate.setMinutes(this.state.userSelectedMinutes);
            } else {
                currentDate.setMinutes(defaultMinutes);
            }

            const formatedHours = this.formatHours(currentDate);
            const formatedMinutes = this.formatMinutes(currentDate);
            this.setState({userSelectedHours: formatedHours, userSelectedMinutes: formatedMinutes}, this.handleChange(currentDate));
        };

        const handleMinutesChange = (e) => {
            const selectedMinutes = e.value;
            const currentDate = initialDate || new Date();
            currentDate.setMinutes(selectedMinutes);
            if (this.state.userSelectedHours) {
                currentDate.setHours(this.state.userSelectedHours);
            } else {
                currentDate.setHours(defaultHours);
            }

            const formatedHours = this.formatHours(currentDate);
            const formatedMinutes = this.formatMinutes(currentDate);
            this.setState({userSelectedMinutes: formatedMinutes, userSelectedHours: formatedHours}, this.handleChange(currentDate));
        };

        return (
            <div className={style.inputWrap}>

                <div className={style.tpWrap}>
                    <div className={style.tpHoursWrap}>
                        <Dropdown
                            data={tpHours}
                            defaultSelected={valueHour}
                            placeholder='Hour'
                            onSelect={handleHoursChange}
                            disabled={this.props.disabled}
                        />
                    </div>
                    <div className={style.tpMinutesWrap}>
                        <Dropdown
                            data={tpMinuts}
                            defaultSelected={valueMin}
                            placeholder='Min'
                            onSelect={handleMinutesChange}
                            disabled={this.props.disabled}
                        />
                    </div>
                </div>

            </div>
        );
    }

    render() {
        const { label } = this.props;

        if (label) {
            return (
                <div>
                    <div className={style.outerWrap}>
                        <div className={style.lableWrap}>
                            {label}
                        </div>
                        {this.getTimePicker()}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {this.getTimePicker()}
                </div>
            );
        }
    }
}

TimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    keyProp: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

TimePicker.defaultProps = {
    onChange: () => {},
    disabled: false
};

export default TimePicker;
