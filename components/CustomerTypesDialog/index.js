import React, { Component, PropTypes} from 'react';
import { getLink } from 'ut-front/react/routerHelper';
import Popup from '../Popup';
import Radio from '../Input/Radio';
import styles from './style.css';

export default class CustomerTypesDialog extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.customerTypes.size === 0 && nextProps.customerTypes.size !== 0 && !this.state.value) {
            this.setState({
                value: nextProps.customerTypes.getIn([0, 'key'])
            });
        }
    }

    get radioOptions() {
        let { customerTypes } = this.props;
        customerTypes = customerTypes.toJS();
        return customerTypes.map(type => ({
            label: type.name,
            value: type.key,
            name: type.customerTypes,
            id: type.key
        }));
    }

    get dialogButtons() {
        const { value } = this.state;
        return [
            {
                label: 'Create',
                href: getLink('ut-customer:customerCreate', { customerType: value }),
                styleType: 'primaryDialog'
            },
            {
                label: 'Close',
                styleType: 'secondaryDialog',
                onClick: this.props.closeDialog
            }
        ];
    }

    get dialogHeader() {
        return {
            className: styles.dialogHeader,
            text: `Choose customer type`
        };
    }

    get dialogFooter() {
        return {
            className: styles.dialogFooter,
            actionButtons: this.dialogButtons
        };
    }

    onChange({ id, key, label, value }) {
        this.setState({ value, id });
    }

    render() {
        const { isOpen, closeDialog } = this.props;

        return (
          <Popup
            isOpen={isOpen}
            header={this.dialogHeader}
            footer={this.dialogFooter}
            closePopup={closeDialog} >
              <div className={styles.popupContainer}>
                <div className={styles.dialogMessage}>{'Please select the type of customer you want to create.'}</div>
                <div className={styles.radioContainer}>
                  <Radio
                    optionClassName={styles.radioOption}
                    options={this.radioOptions}
                    defaultValue={this.state.value}
                    onChange={this.onChange} />
                </div>
              </div>
          </Popup>
        );
    }
}

CustomerTypesDialog.propTypes = {
    isOpen: PropTypes.bool,
    externalSystemTypes: PropTypes.object, // immutable List
    customerTypes: PropTypes.object, // immutable List
    closeDialog: PropTypes.func
};
