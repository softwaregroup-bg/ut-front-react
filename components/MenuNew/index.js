import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import MenuSeparator from './MenuSeparator';
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
            const { menu } = styles;
            const { closeOnSelect } = this.props;

            let isClickInside = Boolean(closest(target, `.${menu}`));

            if (!isClickInside || (isClickInside && closeOnSelect)) {
                this.props.requestClose && this.props.requestClose(e);
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

    addSeparators() {
        const { separatorsOnIndex } = this.props;
        let { fields } = this.props;

        return separatorsOnIndex.reduce((memo, currentIndex) => {
            memo.splice(currentIndex, 0, (<MenuSeparator key={`separator-${currentIndex}`} />));

            return memo;
        }, fields);
    }

    render() {
        const { open } = this.props;

        if (!open) {
            return null;
        }

        let { fields } = this.props;
        const { className, separatorsOnIndex } = this.props;
        const positioningStyles = this.getDimensions();
        fields = separatorsOnIndex.length ? this.addSeparators() : fields;

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
    additionalOffsets: {top: 0, right: 0, bottom: 0, left: 0},
    separatorsOnIndex: []
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
    className: PropTypes.string,
    separatorsOnIndex: PropTypes.array
};
