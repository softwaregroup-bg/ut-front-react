import React, { Component, PropTypes } from 'react';
import styles from './style.css';
import classNames from 'classnames';

export default class CheckboxNew extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const { value, checked, disabled } = this.props;

        if (disabled) {
            return;
        }

        this.props.handleChange && this.props.handleChange({ value, checked: !checked });
    }

    get checkboxClasses() {
        const { checked, disabled } = this.props;

        return classNames({
            [styles.checkboxNew]: true,
            [styles.checked]: true || checked,
            [styles.notAllowed]: disabled
        });
    }

    get checkboxWrapperClasses() {
        const { wrapperClass, fullWidth } = this.props;

        return classNames({
            [styles.checkboxNewAutoWidthContainer]: !fullWidth,
            [styles.checkboxNewContainer]: fullWidth,
            [wrapperClass]: !!wrapperClass
        });
    }

    render() {
        const { label, value, checked } = this.props;
        return (
            <span className={this.checkboxWrapperClasses}>
              <span className={styles.checkboxNewWrapper}>
                <span
                  className={this.checkboxClasses}
                  onClick={this.onChange}
                  data-checked={checked}
                  data-value={value} />
                <span className={styles.checkboxNewLabel}>{label}</span>
              </span>
            </span>
        );
    }
}

CheckboxNew.propTypes = {
    handleChange: PropTypes.func,
    label: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    wrapperClass: PropTypes.string,
    fullWidth: PropTypes.bool
}

CheckboxNew.defaultProps = {
    checked: false,
    disabled: false,
    value: '',
    fullWidth: false
};
