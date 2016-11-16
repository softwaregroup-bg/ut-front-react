import React, { PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import style from './style.css';

const DateInput = (props) => {
    let { placeholder, label } = props;

    if (label) {
        return (
            <div>
                <div className={style.outerWrap}>
                    <div className={style.lableWrap}>
                        {label}
                    </div>
                    <div className={style.inputWrap}>
                        <DatePicker hintText={placeholder} mode='landscape' className={style.datePicker} />
                    </div>
                </div>
            </div>
        );
    } else {
        return <DatePicker {...props} hintText={placeholder} mode='landscape' className={style.datePicker} />;
    }
};

DateInput.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default DateInput;
