/* global localStorage */

import React, { PropTypes, Component } from 'react';
import resizibleTypes from './resizibleTypes';
import localStorageTypes from './localStorageTypes';
import CollapsableContent from '../../components/CollapsableContent';
import style from './style.css';

const heightToSubtratc = 59 + 22 + 91;
const defaultColWidth = 200;
const defaultMinWidth = 10;

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - heightToSubtratc
        };
        this.resize = () => this.setState({
            height: window.innerHeight - heightToSubtratc
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
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);

        // Resizible logic
        this.setResizorsHeight();
        let initObjects = this.props.cols.map((col) => {
            return {domId: col.id, height: '100%', minWidth: col.minWidth, collapsedWidth: col.collapsedWidth, collapsePrev: col.collapsePrev};
        });
        this.initResize(initObjects);
        document.onmouseup = this.updateOnMouseUp;
        document.onmousemove = this.setNewPosition;
    }

    /*
        Resizible logic
    */
    initResize() {
        let args = Array.prototype.slice.call(arguments[0]);
        args.forEach((el) => {
            let currentElement = document.getElementById(el.domId);
            let currentWidth = currentElement.clientWidth;
            let currentMinWidth = el.minWidth || defaultMinWidth;
            let currentCollapsedWidth = el.collapsedWidth;

            let resizeObject = {
                domId: el.domId,
                currentWidth: currentWidth,
                minWidth: currentMinWidth,
                collapsedWidth: currentCollapsedWidth,
                isCollapsed: currentWidth <= currentMinWidth,
                collapsePrev: el.collapsePrev
            };
            this.resizeObjects.push(resizeObject);
        });
        this.resizedInit = true;
    }
    setResizorsHeight() {
        let tableWrap = this.refs.tableWrap;
        let resizorDivs = document.getElementsByClassName(style.visibleResizor);
        for (let i = 0; i < resizorDivs.length; i += 1) {
            let currentResizor = resizorDivs[i];
            currentResizor.style.height = tableWrap.clientHeight + 'px';
        }

        let dotsDivs = document.getElementsByClassName(style.resizorDots);
        for (let i = 0; i < dotsDivs.length; i += 1) {
            let currentDots = dotsDivs[i];
            currentDots.style.top = ((tableWrap.clientHeight - 12) / 2) + 'px'; // 12 --> dots image height
        }
    }
    updateOnMouseUp() {
        if (this.allowMove) {
            // update resizeObjects width
            let resizeObject = this.resizeObjects[this.resizeIndex];
            let nextResizeObject = this.resizeObjects[this.resizeIndex + 1];
            let newFirstClientWidth = this.firstColDom.clientWidth;
            let newSecondClientWidth = this.secondColDom.clientWidth;

            let updateCollapsed = false;
            // < ||||| > (resize first -- <)
            if (newFirstClientWidth < resizeObject.minWidth) {
                let diff = newFirstClientWidth - resizeObject.collapsedWidth;
                newFirstClientWidth = resizeObject.collapsedWidth;
                newSecondClientWidth += diff;
                this.resizeObjects[this.resizeIndex].isCollapsed = true;
                updateCollapsed = true;
            } else if (nextResizeObject && nextResizeObject.collapsePrev && newSecondClientWidth < nextResizeObject.minWidth) { // < ||||| > (resize second -- <)
                let diff = newSecondClientWidth - nextResizeObject.collapsedWidth;
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
        let savedValue = localStorage.getItem('resizibleColumns');
        let getNewArrayValue = () => {
            let newValues = [];
            for (let i = 0; i < this.resizeObjects.length; i += 1) {
                let currentNewValueObject = {};
                currentNewValueObject.width = this.resizeObjects[i].currentWidth;
                newValues.push(currentNewValueObject);
            }
            return newValues;
        };

        if (savedValue) {
            newValue = JSON.parse(savedValue);

            let savedValueColObject = newValue[this.props.localStorageType];
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
            let newPosition = e.clientX;

            /*
                firstObject and secondObject can be resized.
                firstObject will have its dimensions either grown or shrunk.
                secondObject will have the exact opposite done to it that firstObject has.
                If firstObject is shrink by 60px, secondObject is grown by 60px, the opposite also holds true.
            */
            let diffPosition = this.startPosition - newPosition;
            let firstObject = this.resizeObjects[this.resizeIndex];
            let secondObject = this.resizeObjects[this.resizeIndex + 1];
            let firstIndexWidthToUpdate;
            let secondIndexWidthToupdate;

            if (diffPosition < 0) { // right move
                firstIndexWidthToUpdate = firstObject.currentWidth + Math.abs(diffPosition);
                secondIndexWidthToupdate = secondObject.currentWidth + diffPosition; // diffPosition is negative => + -: -
            } else { // left move
                firstIndexWidthToUpdate = firstObject.currentWidth - diffPosition;
                secondIndexWidthToupdate = secondObject.currentWidth + diffPosition;
            }

            // prevent if size gets below min
            if ((!secondObject.collapsePrev && secondIndexWidthToupdate < secondObject.minWidth) || (secondObject.collapsePrev && (firstIndexWidthToUpdate < firstObject.minWidth))) {
                return false;
            }

            // Logic for collapse if min width reached
            let currentIsCollapsed = firstObject.isCollapsed;
            let nextIsCollapsed = secondObject.isCollapsed;
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
        
        if(indexToShrink < 0 || indexToShrink >= this.resizeObjects.length) {
            return;
        }
        
        let offsetToAdd = this.resizeObjects[index].currentWidth - width;
        let secondColNewWidth = this.resizeObjects[indexToShrink].currentWidth + offsetToAdd;

        let firstColDom = document.getElementById(this.resizeObjects[index].domId);
        let secondColDom = document.getElementById(this.resizeObjects[indexToShrink].domId);

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
            case resizibleTypes.ASIDE:
                let collapsableContenetStyles = col.styles || {};
                let onCollapseHanlder = (isCollapsed) => {
                    if (isCollapsed) {
                        this.setSpecificWidth(index, col.collapsedWidth, col.collapsePrev);
                    } else {
                        this.setSpecificWidth(index, col.normalWidth, col.collapsePrev);
                    }
                    this.resizeObjects[index].isCollapsed = isCollapsed;
                };
                let isCollapsed = this.resizeObjects[index] ? this.resizeObjects[index].isCollapsed : false;

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
            case resizibleTypes.CONTENT:
                return (
                    <div className={style.contentWrap} 
                        style={{height: this.state.height, overflow: 'auto'}}>
                        {col.child}
                    </div>
                );
            default:
                return <div />;
        }
    }

    render() {
        let renderCols = [];
        this.props.cols.forEach((col, index) => {
            let currentWidth = col.width || defaultColWidth;
            let currentStyles = {width: currentWidth + 'px', maxWidth: currentWidth + 'px'};
            let handleOnMouseDownEvent = (e) => {
                this.setPosition(e, (index - 1));
            };

            let contentClass = col.type === resizibleTypes.CONTENT ? style.innerCol : null;

            let colResult = (
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
            <div style={{height: this.state.height}}>
                <div ref='tableWrap' id={style.mainContentWrap}>
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
    localStorageType: PropTypes.string
};

Container.defaultProps = {
    localStorageType: localStorageTypes.THREE_COLS
};

export default Container;
