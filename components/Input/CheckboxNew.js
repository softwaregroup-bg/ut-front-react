import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

        return classNames(styles.checkboxNew, {
            [styles.checkedCheckbox]: checked,
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

    get checkboxLabelClasses() {
        const { disabled } = this.props;

        return classNames(styles.checkboxNewLabel, {
            [styles.notAllowed]: disabled
        });
    }

    render() {
        const { label } = this.props;
        return (
            <span className={this.checkboxWrapperClasses}>
                <span className={styles.checkboxNewWrapper}>
                    <span
                        className={this.checkboxClasses}
                        onClick={this.onChange} />
                    <span
                        className={this.checkboxLabelClasses}
                        onClick={this.onChange} >{label}</span>
                </span>
            </span>
        );
    }
}

CheckboxNew.propTypes = {
    handleChange: PropTypes.func,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    wrapperClass: PropTypes.string,
    fullWidth: PropTypes.bool
};

CheckboxNew.defaultProps = {
    checked: false,
    disabled: false,
    value: '',
    fullWidth: false
};
