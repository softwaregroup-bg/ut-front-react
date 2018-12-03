import React, {Component, PropTypes} from 'react';
import styles from './style.css';
import classnames from 'classnames';

let defaultStates = [
    {
        value: 1,
        name: 'None',
        style: styles.multiCheckboxDefaultNone,
        errorMessage: 'Not Valid'
    },
    {
        value: 2,
        name: 'Checked',
        style: styles.multiCheckboxDefaultChecked,
        errorMessage: 'Not Valid'
    }
];

class MultiCheckbox extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(checked, states) {
        let {onClick, readOnly, newStatusMapper} = this.props;
        let value;
        let foundNewStatusMapper = newStatusMapper.find((nsp) => {
            return nsp.value === states[checked]['value'];
        });
        if (foundNewStatusMapper) {
            value = {
                value: states[foundNewStatusMapper.nextValue]['value'],
                name: states[foundNewStatusMapper.nextValue]['name']
            };
        } else {
            let nextState = checked + 1;
            if (nextState === states.length) {
                value = {
                    value: states[0]['value'],
                    name: states[0]['name']
                };
            } else {
                value = {
                    value: states[nextState]['value'],
                    name: states[nextState]['name']
                };
            }
        }

        if (!readOnly) {
            onClick(value);
        }
    }

    render() {
        let {checked, states, readOnly, showStateName, isValid, label} = this.props;
        let ifReadOnly = readOnly ? styles.multiCheckboxReadOnly : '';
        let customStyle = states[checked]['style'];
        let handleClick = (e) => {
            this.handleClick(checked, states);
        };
        return (
            <div className={classnames(styles.multiCheckboxWrapper)} onClick={handleClick}>
                <span className={classnames(styles.multiCheckbox, customStyle, ifReadOnly)}>{showStateName && states[checked]['name']}</span>
                <span className={styles.multiCheckboxLabel}>{label}</span>
                {!isValid && <div className={styles.multiCheckboxError}>{states[checked]['errorMessage']}</div>}
            </div>
        );
    }
}

MultiCheckbox.propTypes = {
    checked: PropTypes.number, // array index of the active object in states prop
    label: PropTypes.string,
    states: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any, // value - it will be passed to onClick handler
        name: PropTypes.string, // name of the current state - it will be passed to onClick handler
        style: PropTypes.string, // css class to style the checkbox according to the current state
        errorMessage: PropTypes.string // error message to display when validation does not pass.
    })),
    newStatusMapper: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number,
        nextvalue: PropTypes.number
    })),
    onClick: PropTypes.func, // function that will recieve info about the next state selected as first argument
    isValid: PropTypes.bool,
    readOnly: PropTypes.bool,
    showStateName: PropTypes.bool // show the name of the current state inside the box
};

MultiCheckbox.defaultProps = {
    checked: 0,
    states: defaultStates,
    newStatusMapper: [],
    isValid: true,
    readOnly: false,
    showStateName: false,
    onClick: (e) => e
};

export default MultiCheckbox;
