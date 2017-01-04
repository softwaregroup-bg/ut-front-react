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
        const { open } = this.props;
        if (open) {
            const { target } = e;
            const { menu, avatarInfoArrow } = styles;
            const { closeOnSelect } = this.props;

            let isClickInside = Boolean(closest(target, `.${menu}`)) ||
                Boolean(closest(target, `.${avatarInfoArrow}`));

            if (!isClickInside || (isClickInside && closeOnSelect)) {
                this.props.requestClose && this.props.requestClose();
            }
        }
    }

    render() {
        const { open } = this.props;

        if (!open) {
            return null;
        }

        let { style } = this.props;
        const { dimensions, fields } = this.props;

        style = Object.assign({}, style, dimensions);

        return (
            <div
              style={style}
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
    style: PropTypes.object,
    dimensions: PropTypes.object,
    fields: PropTypes.array,
    closeOnSelect: PropTypes.bool
};
