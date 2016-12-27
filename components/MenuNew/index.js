import React, { Component, PropTypes } from 'react';
import { closest } from './../../utils/dom';
import styles from './styles.css';

export default class MenuNew extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClick);
    }

    handleClick(e) {
        if (this.props.open) {
            const { target } = e;
            const { menu, avatarInfoArrow } = styles;

            let isClickInside = Boolean(closest(target, `.${menu}`)) ||
                Boolean(closest(target, `.${avatarInfoArrow}`));

            if (!isClickInside) {
                this.props.requestClose && this.props.requestClose();
            }
        }
    }

    render() {
        const { dimensions, open } = this.props;
        var fields = this.props.fields;

        if (!open) {
            return null;
        }

        return (
            <div
              style={dimensions}
              className={styles.menu} >
              {fields}
            </div>
        );
    }
}

MenuNew.defaultProps = {
    open: false,
    dimensions: {},
    fields: []
};

MenuNew.propTypes = {
    open: PropTypes.bool.isRequired,
    requestClose: PropTypes.func.isRequired,
    dimensions: PropTypes.object,
    fields: PropTypes.array
};
