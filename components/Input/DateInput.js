import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import classnames from 'classnames';
import style from './style.css';

const DateInput = (props) => {
    const { placeholder, label, boldLabel } = props;

    if (label) {
        return (
            <div>
                <div className={style.outerWrap}>
                    <div className={classnames(style.lableWrap, {[style.boldLabel]: boldLabel})}>
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
    placeholder: PropTypes.string,
    boldLabel: PropTypes.bool
};

DateInput.defaultProps = {
    boldLabel: true
};

export default DateInput;
