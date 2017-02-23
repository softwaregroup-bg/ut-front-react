import React, { Component } from 'react';

import DateTimePicker from '../Simple';

class DateTimePickerBetween extends Component {
    render() {
        return (
            <div>
                <div>
                    <DateTimePicker />
                </div>
                <div>
                    <DateTimePicker />
                </div>
            </div>
        );
    }
}

DateTimePickerBetween.propTypes = {

};

export default DateTimePickerBetween;
