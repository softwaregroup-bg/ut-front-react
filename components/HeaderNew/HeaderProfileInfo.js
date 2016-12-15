import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import MenuNew from './../MenuNew';
import styles from './styles.css';
import { getMarginBox } from '../../utils/dom';
import { getDimensions } from '../../utils/positioning';

export default class HeaderProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuToggled: false
        };
        this.onClick = this.onClick.bind(this);
        this.calculateDimensions = this.calculateDimensions.bind(this);
        this.toggleMenu = debounce(this.toggleMenu, 200);
        this.onMenuBlur = this.onMenuBlur.bind(this);
    }

    calculateDimensions() {
        let arrowDimensions = getMarginBox(this.infoArrowNode);
        arrowDimensions.height = arrowDimensions.height; // TO DO handle additional offset

        return arrowDimensions;
    }

    onClick(e) {
        this.toggleMenu();
    }

    onMenuBlur(e) {
        this.toggleMenu();
    }

    toggleMenu() {
        this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    render() {
        const { menuToggled } = this.state;

        return (
            <span
              className={classNames(styles.headerComponent, styles.profileContainer)}
              ref={(element) => { this.infoArrowNode = element; }} >
                <span
                  className={styles.avatarInfoArrow}
                  onClick={this.onClick} />
                <span className={styles.avatarContainer} />
                {menuToggled
                  ? <MenuNew onBlur={this.onMenuBlur} dimensions={getDimensions('right-bottom', this.calculateDimensions())} />
                  : false}
            </span>
        );
    }
}
