/* global localStorage */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import resizibleTypes from './resizibleTypes';
import localStorageTypes from './localStorageTypes';
import CollapsableContent from '../../components/CollapsableContent';
import cssStandard from '../../assets/index.css';
import style from './style.css';
import classnames from 'classnames';

const defaultColWidth = 200;
const defaultMinWidth = 10;

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - props.heightToSubtract
        };
        this.resize = () => this.setState({
            height: window.innerHeight - props.heightToSubtract
        });

        // Resizible logic
        this.resizedInit = false;
        this.resizeObjects = []; // E.g. {domId: [string], currentWidth: [int], minWidth: [int], isCollapsed: false}

        this.allowMove = false;
        this.startPosition = 0;
        this.resizeIndex = -1;

        // Used to store dom elements on click down instead of search for them each time we have to change width
        this.firstColDom = null;
        this.secondColDom = null;

        this.initResize = this.initResize.bind(this);
        this.setResizorsHeight = this.setResizorsHeight.bind(this);
        this.updateOnMouseUp = this.updateOnMouseUp.bind(this);
        this.setNewPosition = this.setNewPosition.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setSpecificWidth = this.setSpecificWidth.bind(this);
        this.updateFirstAndSecondColDom = this.updateFirstAndSecondColDom.bind(this);
        this.updateResizableObjects = this.updateResizableObjects.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let isUpdateResizeObjsNeeded = false;
        nextProps.cols && nextProps.cols.length && nextProps.cols.forEach(obj => {
            if (!this.resizeObjects.find(ro => ro.domId === obj.domId)) isUpdateResizeObjsNeeded = true;
        });
        isUpdateResizeObjsNeeded && this.updateResizableObjects();
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.props.cols && this.props.cols.length && this.updateResizableObjects();
        // Resizible logic
        this.setResizorsHeight();
        this.initResize();
        document.onmouseup = this.updateOnMouseUp;
        document.onmousemove = this.setNewPosition;
    }

    updateResizableObjects() {
        this.resizeObjects = [];
        const args = this.props.cols.map((col) => {
            return {domId: col.id, height: '100%', minWidth: col.minWidth, collapsedWidth: col.collapsedWidth, collapsePrev: col.collapsePrev};
        });
        args.forEach((el) => {
            const currentElement = document.getElementById(el.domId);
            const currentWidth = (currentElement && currentElement.clientWidth) || defaultColWidth;
            const currentMinWidth = el.minWidth || defaultMinWidth;
            const currentCollapsedWidth = el.collapsedWidth;

            const resizeObject = {
                domId: el.domId,
                currentWidth: currentWidth,
                minWidth: currentMinWidth,
                collapsedWidth: currentCollapsedWidth,
                isCollapsed: currentWidth <= currentMinWidth,
                collapsePrev: el.collapsePrev
            };
            this.resizeObjects.push(resizeObject);
        });
    }

    /*
        Resizible logic
    */
    initResize() {
        this.resizedInit = true;
    }

    setResizorsHeight() {
        const tableWrap = this.refs.tableWrap;
        const resizorDivs = document.getElementsByClassName(style.visibleResizor);
        for (let i = 0; i < resizorDivs.length; i += 1) {
            const currentResizor = resizorDivs[i];
            currentResizor.style.height = tableWrap.clientHeight + 'px';
        }

        const dotsDivs = document.getElementsByClassName(style.resizorDots);
        for (let i = 0; i < dotsDivs.length; i += 1) {
            const currentDots = dotsDivs[i];
            currentDots.style.top = ((tableWrap.clientHeight - 12) / 2) + 'px'; // 12 --> dots image height
        }
    }

    updateOnMouseUp() {
        if (this.allowMove) {
            // update resizeObjects width
            const resizeObject = this.resizeObjects[this.resizeIndex];
            const nextResizeObject = this.resizeObjects[this.resizeIndex + 1];
            let newFirstClientWidth = this.firstColDom.clientWidth;
            let newSecondClientWidth = this.secondColDom.clientWidth;

            let updateCollapsed = false;
            // < ||||| > (resize first -- <)
            if (newFirstClientWidth < resizeObject.minWidth) {
                const diff = newFirstClientWidth - resizeObject.collapsedWidth;
                newFirstClientWidth = resizeObject.collapsedWidth;
                newSecondClientWidth += diff;
                this.resizeObjects[this.resizeIndex].isCollapsed = true;
                updateCollapsed = true;
            } else if (nextResizeObject && nextResizeObject.collapsePrev && newSecondClientWidth < nextResizeObject.minWidth) { // < ||||| > (resize second -- <)
                const diff = newSecondClientWidth - nextResizeObject.collapsedWidth;
                newSecondClientWidth = nextResizeObject.collapsedWidth;
                newFirstClientWidth += diff;
                this.resizeObjects[this.resizeIndex + 1].isCollapsed = true;
                updateCollapsed = true;
            }

            if (updateCollapsed) {
                this.updateFirstAndSecondColDom(newFirstClientWidth, newSecondClientWidth);
                this.forceUpdate();
            }

            this.resizeObjects[this.resizeIndex].currentWidth = newFirstClientWidth;
            this.resizeObjects[this.resizeIndex + 1].currentWidth = newSecondClientWidth;

            this.updateLocalStorage(this.resizeIndex, this.resizeIndex + 1);

            this.firstColDom = null;
            this.secondColDom = null;
        }

        this.allowMove = false;
        return false;
    }

    updateLocalStorage(firstIndex, secondIndex) {
        let newValue;
        const savedValue = localStorage.getItem('resizibleColumns');
        const getNewArrayValue = () => {
            const newValues = [];
            for (let i = 0; i < this.resizeObjects.length; i += 1) {
                const currentNewValueObject = {};
                currentNewValueObject.width = this.resizeObjects[i].currentWidth;
                newValues.push(currentNewValueObject);
            }
            return newValues;
        };

        if (savedValue) {
            newValue = JSON.parse(savedValue);

            const savedValueColObject = newValue[this.props.localStorageType];
            if (savedValueColObject) {
                savedValueColObject[firstIndex] = {width: this.resizeObjects[firstIndex].currentWidth};
                savedValueColObject[secondIndex] = {width: this.resizeObjects[secondIndex].currentWidth};
            } else {
                newValue[this.props.localStorageType] = getNewArrayValue();
            }
        } else {
            newValue = {};
            newValue[this.props.localStorageType] = getNewArrayValue();
        }

        localStorage.setItem('resizibleColumns', JSON.stringify(newValue));
    }

    setNewPosition(e) {
        if (this.resizedInit && this.allowMove) {
            e.preventDefault(); // disable selection
            const newPosition = e.clientX;

            /*
                firstObject and secondObject can be resized.
                firstObject will have its dimensions either grown or shrunk.
                secondObject will have the exact opposite done to it that firstObject has.
                If firstObject is shrink by 60px, secondObject is grown by 60px, the opposite also holds true.
            */
            const diffPosition = this.startPosition - newPosition;
            const firstObject = this.resizeObjects[this.resizeIndex];
            const secondObject = this.resizeObjects[this.resizeIndex + 1];
            let firstIndexWidthToUpdate;
            let secondIndexWidthToupdate;
            const isTextDirectionRightToLeft = document.documentElement.getAttribute('dir') &&  document.documentElement.getAttribute('dir').toLowerCase() === 'rtl';
            
            if (isTextDirectionRightToLeft) {
                if (diffPosition < 0) { // right move
                    firstIndexWidthToUpdate = firstObject.currentWidth - Math.abs(diffPosition);
                    secondIndexWidthToupdate = secondObject.currentWidth - diffPosition; // diffPosition is negative => + -: -
                } else { // left move
                    firstIndexWidthToUpdate = firstObject.currentWidth + diffPosition;
                    secondIndexWidthToupdate = secondObject.currentWidth - diffPosition;
                }
            } else {
                if (diffPosition < 0) { // right move
                    firstIndexWidthToUpdate = firstObject.currentWidth + Math.abs(diffPosition);
                    secondIndexWidthToupdate = secondObject.currentWidth + diffPosition; // diffPosition is negative => + -: -
                } else { // left move
                    firstIndexWidthToUpdate = firstObject.currentWidth - diffPosition;
                    secondIndexWidthToupdate = secondObject.currentWidth + diffPosition;
                }
            }

            // prevent if size gets below min
            if ((!secondObject.collapsePrev && secondIndexWidthToupdate < secondObject.minWidth) || (secondObject.collapsePrev && (firstIndexWidthToUpdate < firstObject.minWidth))) {
                return false;
            }

            // Logic for collapse if min width reached
            const currentIsCollapsed = firstObject.isCollapsed;
            const nextIsCollapsed = secondObject.isCollapsed;
            if (currentIsCollapsed && firstIndexWidthToUpdate > firstObject.minWidth) {
                this.resizeObjects[this.resizeIndex].isCollapsed = false;
                this.forceUpdate();
            } else if (!currentIsCollapsed && firstIndexWidthToUpdate < firstObject.minWidth) {
                this.resizeObjects[this.resizeIndex].isCollapsed = true;
                this.forceUpdate();
            } else if (secondObject.collapsePrev && nextIsCollapsed && secondIndexWidthToupdate > secondObject.minWidth) { // Next collapse logic
                this.resizeObjects[this.resizeIndex + 1].isCollapsed = false;
                this.forceUpdate();
            } else if (secondObject.collapsePrev && !nextIsCollapsed && secondIndexWidthToupdate < secondObject.minWidth) {
                this.resizeObjects[this.resizeIndex + 1].isCollapsed = true;
                this.forceUpdate();
            }

            this.updateFirstAndSecondColDom(firstIndexWidthToUpdate, secondIndexWidthToupdate);
        }
        return true;
    }

    setPosition(e, currentResizeIndex) {
        this.startPosition = e.clientX;
        this.allowMove = true;

        this.firstColDom = document.getElementById(this.resizeObjects[currentResizeIndex].domId);
        this.secondColDom = document.getElementById(this.resizeObjects[currentResizeIndex + 1].domId);
        this.resizeIndex = currentResizeIndex;
        return true;
    }

    setSpecificWidth(index, width, collapsePrev) {
        let indexToShrink;
        if (collapsePrev) {
            indexToShrink = index - 1;
        } else {
            indexToShrink = index + 1;
        }

        const offsetToAdd = this.resizeObjects[index].currentWidth - width;
        const secondColNewWidth = this.resizeObjects[indexToShrink].currentWidth + offsetToAdd;

        const firstColDom = document.getElementById(this.resizeObjects[index].domId);
        const secondColDom = document.getElementById(this.resizeObjects[indexToShrink].domId);

        firstColDom.style.width = width + 'px';
        firstColDom.style.maxWidth = width + 'px';
        secondColDom.style.width = secondColNewWidth + 'px';
        secondColDom.style.maxWidth = secondColNewWidth + 'px';

        this.resizeObjects[index].currentWidth = width;
        this.resizeObjects[indexToShrink].currentWidth = secondColNewWidth;
        this.updateLocalStorage(index, indexToShrink);
    }

    updateFirstAndSecondColDom(firstColWidth, secondColWidth) {
        this.firstColDom.style.width = firstColWidth + 'px';
        this.firstColDom.style.maxWidth = firstColWidth + 'px';
        this.secondColDom.style.width = secondColWidth + 'px';
        this.secondColDom.style.maxWidth = secondColWidth + 'px';
    }
    /*
        End Resizible logic
    */

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    renderCol(col, index) {
        switch (col.type) {
            case resizibleTypes.ASIDE: {
                const collapsableContenetStyles = col.styles || {};
                const onCollapseHanlder = (isCollapsed) => {
                    if (isCollapsed) {
                        this.setSpecificWidth(index, col.collapsedWidth, col.collapsePrev);
                    } else {
                        this.setSpecificWidth(index, col.normalWidth, col.collapsePrev);
                    }
                    this.resizeObjects[index].isCollapsed = isCollapsed;
                };
                const isCollapsed = this.resizeObjects[index] ? this.resizeObjects[index].isCollapsed : false;

                return (
                    <CollapsableContent
                        heading={col.heading}
                        info={col.info}
                        orientation={col.right ? 'right' : 'left'}
                        visibleStyles={{height: this.state.height, ...collapsableContenetStyles}}
                        isCollapsed={isCollapsed}
                        onCollapse={onCollapseHanlder}
                    >
                        {col.child}
                    </CollapsableContent>
                );
            }
            case resizibleTypes.CONTENT: {
                return (
                    <div className={style.contentWrap} style={{height: this.state.height, maxHeight: '100%'}}>
                        {this.props.cssStandard
                            ? <div className={cssStandard.contentTableWrap}> {col.child} </div>
                            : col.child}
                    </div>
                );
            }
            default:
                return <div />;
        }
    }

    render() {
        const renderCols = [];
        this.props.cols.forEach((col, index) => {
            const currentWidth = col.width || defaultColWidth;
            const currentStyles = {width: currentWidth + 'px', maxWidth: currentWidth + 'px'};
            const handleOnMouseDownEvent = (e) => {
                this.setPosition(e, (index - 1));
            };

            const contentClass = col.type === resizibleTypes.CONTENT ? style.innerCol : null;
            //const isTextDirectionRightToLeft = document.getElementsByTagName('html')[0].getAttribute('dir') && (document.getElementsByTagName('html')[0].getAttribute('dir').toLowerCase() === 'rtl');
            //const resizorDirectionClass = isTextDirectionRightToLeft ? style.resizorRtl : style.resizorLtr;

            const colResult = (
                <div id={col.id} key={index} className={style.col} style={currentStyles}>
                    <div className={contentClass} style={col.innerColStyles}>
                        {this.renderCol(col, index)}
                    </div>

                    {
                        index !== 0 &&
                        <span className={style.resizor} onMouseDown={handleOnMouseDownEvent}>
                            <span className={style.visibleResizor} />
                            <span className={style.resizorDots} />
                        </span>
                    }
                </div>
            );
            renderCols.push(colResult);
        });

        return (
            <div style={{height: this.state.height, maxHeight: '100%'}}>
                <div ref='tableWrap' id={style.mainContentWrap} className={this.props.externalClassName}>
                    {renderCols}
                </div>
            </div>
        );
    }
}

Container.propTypes = {
    cols: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf([resizibleTypes.ASIDE, resizibleTypes.CONTENT]).isRequired,
        child: PropTypes.any.isRequired,
        width: PropTypes.number, // || defaultColWidth The defualt witch which the aside is rendered
        minWidth: PropTypes.number, // || defaultMinWidth The default widht which the aside can shrink
        innerColStyles: PropTypes.object,

        // ASIDE
        collapsedWidth: PropTypes.number,
        collapsePrev: PropTypes.bool, // when click on collapse tab decide the tab that should be shrink
        heading: PropTypes.string,
        info: PropTypes.string,
        styles: PropTypes.object,
        right: PropTypes.bool
    }).isRequired),
    cssStandard: PropTypes.bool,
    externalClassName: PropTypes.string,
    localStorageType: PropTypes.string,
    heightToSubtract: PropTypes.number
};

Container.defaultProps = {
    localStorageType: localStorageTypes.THREE_COLS,
    heightToSubtract: 59 + 22 + 91,
    cssStandard: false
};

export default Container;
