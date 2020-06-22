import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import TimePicker from './../Simple';
import style from './style.css';
import { defaultTimeValues } from './../defaultValues';

export default class TimePickerRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValueFrom: {
                key: null,
                name: props.defaultSelectedFrom || ''
            },
            selectedValueTo: {
                key: null,
                name: props.defaultSelectedTo || ''
            }
        };
        this.getIndexSelectedByValue = this.getIndexSelectedByValue.bind(this);
        this.convertDataFrom = this.convertDataFrom.bind(this);
        this.convertDataTo = this.convertDataTo.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selectedValueFrom: {
                key: null,
                name: newProps.defaultSelectedFrom || ''
            },
            selectedValueTo: {
                key: null,
                name: newProps.defaultSelectedTo || ''
            }
        });
    }

    getIndexSelectedByValue(selectedValue) {
        return this.props.data.findIndex((index) => { return index.key === selectedValue; });
    }

    convertDataFrom(selectedValueTo) {
        let index = this.getIndexSelectedByValue(selectedValueTo);
        let data = JSON.parse(JSON.stringify(this.props.data)); // create a copy so not to mutate props
        for (let i = 0; i < data.length; i++) {
            if (index !== -1 && i >= index) {
                data[i].disabled = true;
            }
        }
        return data;
    }

    convertDataTo(selectedValueFrom) {
        let index = this.getIndexSelectedByValue(selectedValueFrom);
        let data = JSON.parse(JSON.stringify(this.props.data)); // create a copy so not to mutate props
        for (let i = 0; i < data.length; i++) {
            if (index !== -1 && i <= index) {
                data[i].disabled = true;
            }
        }
        return data;
    }

    render() {
        let dataFrom = this.convertDataFrom(this.state.selectedValueTo.name);
        let dataTo = this.convertDataTo(this.state.selectedValueFrom.name);
        let handleChangeFrom = (event) => {
            this.setState({
                selectedValueFrom: {
                    key: event.key,
                    name: event.value
                }
            });
            this.props.onChangeFrom(event);
        };
        let handleChangeTo = (event) => {
            this.setState({
                selectedValueTo: {
                    key: event.key,
                    name: event.value
                }
            });
            this.props.onChangeTo(event);
        };
        return (
            <div className={this.props.className} style={this.props.style}>
                <div className='clearfix'>
                    <div className={style.flLeft}>
                        <TimePicker
                            keyProp='From'
                            data={dataFrom}
                            defaultSelected={this.props.defaultSelectedFrom}
                            disabled={this.props.disabled}
                            defaultLabel={this.props.defaultLabelFrom}
                            onChange={handleChangeFrom}
                        />
                    </div>
                    <div className={classnames(style.flLeft, style.separator)}>-</div>
                    <div className={style.flLeft}>
                        <TimePicker
                            keyProp='To'
                            data={dataTo}
                            defaultSelected={this.props.defaultSelectedTo}
                            disabled={this.props.disabled}
                            defaultLabel={this.props.defaultLabelTo}
                            onChange={handleChangeTo}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TimePickerRange.defaultProps = {
    defaultLabelFrom: 'From',
    defaultLabelTo: 'To',
    onChangeFrom: () => {},
    onChangeTo: () => {},
    disabled: false,
    data: defaultTimeValues
};

TimePickerRange.propTypes = {
    defaultLabelFrom: PropTypes.string,
    defaultLabelTo: PropTypes.string,
    onChangeFrom: PropTypes.func,
    onChangeTo: PropTypes.func,
    defaultSelectedFrom: PropTypes.any,
    defaultSelectedTo: PropTypes.any,
    disabled: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string.isRequired
    })),
    className: PropTypes.string,
    style: PropTypes.object
};
