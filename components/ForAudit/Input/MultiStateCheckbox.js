import React, { PropTypes, Component } from 'react';
import style from './style.css';
import classnames from 'classnames';

const states = [
    null,
    'checked',
    'unchecked'
];
class MultiStateCheckbox extends Component {
    componentWillMount() {
        this.state = {
            selected: this.props.checked === true ? states[1] : this.props.checked === false ? states[2] : states[0],
            own: this.props.own || this.props.checked === null
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reload) {
            this.state = {
                selected: nextProps.checked === true ? states[1] : nextProps.checked === false ? states[2] : states[0],
                own: nextProps.own || nextProps.checked === null
            };
        }
    }
    onClick() {
        let oldState = states.indexOf(this.state.selected);
        let newState = oldState > -1 && oldState < states.length - 1 ? oldState + 1 : 0;
        this.setState({
            selected: states[newState],
            own: true
        });
        let value = newState === 1 ? true : newState === 2 ? false : null;
        this.props.onChange(value);
    }

    render() {
        let inherited = !this.state.own ? style.inherited : {};
        let selectedClass = this.state.selected ? style[this.state.selected] : {};
        let click = () => this.onClick();
        return <label className={classnames(style.multistatecheckbox, inherited, selectedClass)}>
                <input {...this.props} type='checkbox' onChange={click} />
                <span />
            </label>;
    }
};

MultiStateCheckbox.propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    own: PropTypes.bool,
    reload: PropTypes.bool
};

export default MultiStateCheckbox;
