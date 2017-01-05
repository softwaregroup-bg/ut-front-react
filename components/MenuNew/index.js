import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { closest, getMarginBox } from '../../utils/dom';
import { getDimensions } from '../../utils/positioning';
import styles from './styles.css';

export default class MenuNew extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.getDimensions = this.getDimensions.bind(this);
        this.calculateDimensions = this.calculateDimensions.bind(this);
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

    getDimensions() {
        const { positioningDirections, additionalOffsets } = this.props;

        return getDimensions(
            positioningDirections,
            this.calculateDimensions(),
            additionalOffsets
        );
    }

    calculateDimensions() {
        return getMarginBox(this.props.anchorEl);
    }

    render() {
        const { open } = this.props;

        if (!open) {
            return null;
        }

        const { fields, className } = this.props;
        const positioningStyles = this.getDimensions();

        return (
            <div
              style={positioningStyles}
              className={classNames(styles.menu, styles.standardMenu, className)} >
              {fields}
            </div>
        );
    }
}

MenuNew.defaultProps = {
    open: false,
    dimensions: {},
    fields: [],
    anchorEl: null,
    positioningDirections: 'right-bottom',
    additionalOffsets: {top: 0, right: 0, bottom: 0, left: 0}
};

MenuNew.propTypes = {
    open: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
    requestClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
    dimensions: PropTypes.object,
    closeOnSelect: PropTypes.bool,
    positioningDirections: PropTypes.string,
    additionalOffsets: PropTypes.object,
    className: PropTypes.string
};
