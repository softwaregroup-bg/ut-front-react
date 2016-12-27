import React, { Component, PropTypes } from 'react';

import Dropdown from '../Input/Dropdown';

import classnames from 'classnames';
import dropdownstyles from './dropdownstyles.css';
import styles from './styles.css';
const separateSymbol = '...';

class AdvancedPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumberInputVal: this.props.pagination.get('pageNumber'),
            showLeftMorePagesBox: false,
            showRightMorePagesBox: false
        };
        this.setPaginationProps(props.pagination);

        this.handleChange = this.handleChange.bind(this);
        this.renderPageSwitcher = this.renderPageSwitcher.bind(this);
        this.renderPageBoxes = this.renderPageBoxes.bind(this);
        this.renderPageSizeBox = this.renderPageSizeBox.bind(this);
    }

    componentWillReceiveProps({pagination}) {
        if (this.props.pagination !== pagination) {
            this.setPaginationProps(pagination);
            this.setState({pageNumberInputVal: this.pageNumber, showLeftMorePagesBox: false, showRightMorePagesBox: false});
        }
    }

    setPaginationProps(pagination) {
        this.pagesTotal = pagination.get('pagesTotal') || Math.ceil(pagination.get('recordsTotal') / pagination.get('pageSize')) || 0;
        this.pageNumber = pagination.get('pageNumber');
        this.pageSize = pagination.get('pageSize');
        this.recordsTotal = pagination.get('recordsTotal');
    }

    handleChange(pageNumber, pageSize) {
        let { pagination, onUpdate } = this.props;
        pageNumber = pageNumber | 0;
        let objToReturn = {};

        if (pageNumber && pageSize) {
            objToReturn = pagination
                .set('pageNumber', pageNumber)
                .set('pageSize', pageSize);
        } else if (pageNumber) {
            objToReturn = pagination.set('pageNumber', pageNumber);
        } else if (pageSize) {
            objToReturn = pagination.set('pageSize', pageSize);
        } else {
            objToReturn = pagination;
        }

        onUpdate(objToReturn);
    }

    renderPageSwitcher() {
        // We have event for keydown and if enter is clicked request is made.
        // We do not want to make the same request once blur out of the box - it is already made
        let monitorForBlurEvent = true;
        let handleNumberInputChange = (e) => { this.setState({pageNumberInputVal: e.target.value}); };
        let updateNumberInput = (number) => {
            number = Math.abs(Math.floor(number | 0));
            if (number === 0) number = 1;
            if (number > this.pagesTotal) {
                number = this.pagesTotal;
                this.setState({pageNumberInputVal: number}, () => { this.handleChange(number); });
            } else {
                this.setState({pageNumberInputVal: number}, () => { this.handleChange(number); }); // to update value if user enters incorrect value
            }
        };
        let handleNumberInputBlur = (e) => {
            if (monitorForBlurEvent) {
                let val = e.target.value;
                updateNumberInput(val);
            } else {
                monitorForBlurEvent = true;
            }
        };
        let handleNumberInputKeyDown = (e) => {
            if (e.keyCode === 13) {
                let val = e.target.value;
                monitorForBlurEvent = false;
                updateNumberInput(val);
            }
        };

        return (
            <div className={styles.pageSwitherWrap}>
                <div className={styles.numberInputWrap}>
                    <input type='number' value={this.state.pageNumberInputVal || 1} className={styles.numberInput} max={this.pagesTotal} min={1}
                      onChange={handleNumberInputChange} onBlur={handleNumberInputBlur} onKeyDown={handleNumberInputKeyDown} />
                </div>
                <div className={styles.rightWrap}>
                    / <span className={styles.bold}>{this.pagesTotal}</span> <span className={styles.lighColor}>Pages</span>
                </div>
            </div>
        );
    }

    renderPageBoxes() {
        let pageBoxes = [];
        /**
         * Examples:
         *  1 ..  5  6  7  8  9 .. 20    ACTIVE:7
         *  1  2  3  4  5  6  7 .. 20    ACTIVE:1
         *  1  2  3  4  5  6  7  8  9    ACTIVE:9
         *  1  2  3  4  5  6  7 .. 10    ACTIVE 2
         *  1 ..  5  6  7  8  9 .. 16    ACTIVE:7
        */

        let pushBoxToPagesBoxes = (number, isActive = false) => {
            let pageBoxClassnames = styles.pageBox;
            if (isActive) {
                pageBoxClassnames = classnames(pageBoxClassnames, styles.active);
            }
            let clickHandler = () => { this.handleChange(number); };

            pageBoxes.push(
                <div className={pageBoxClassnames} onClick={clickHandler} key={Math.random()}>
                    {number}
                </div>
            );
        };

        let pushSeparateSymbol = (leftSide, start, end) => {
            let morePagesBoxes = [];
            let morePagesWrapStyles = styles.morePagesWrap;
            let morePagesWrapWidth = 152;
            let arrowWrapStyles = styles.arrowWrap;
            let arrowWrapLeftOffset = 4;
            let morePagesBoxAddedNumber = 0;

            // More pages box
            let pushMorePageBox = (number) => {
                let innerClickHandler = (e) => {
                    e.stopPropagation();
                    this.handleChange(number);
                };
                morePagesBoxes.push(
                    <div className={styles.morePageBox} onClick={innerClickHandler} key={Math.random()}>
                        {number}
                    </div>
                );
                morePagesBoxAddedNumber += 1;
            };

            let insertedNumbers = 0;
            if (leftSide) {
                let numbersToPush = [];
                for (let i = start - 1; i > end && insertedNumbers < 16; i -= 1, insertedNumbers += 1) {
                    numbersToPush.push(i);
                }
                numbersToPush.reverse();
                for (let i = 0; i < numbersToPush.length; i += 1) {
                    pushMorePageBox(numbersToPush[i]);
                }
            } else {
                for (let i = start + 1; i < end && insertedNumbers < 16; i += 1, insertedNumbers += 1) {
                    pushMorePageBox(i);
                }
            }

            let clickHandler = () => {
                let self = this;
                if (leftSide) {
                    let handleLeftDocCloseFunc = function(e) {
                        document.removeEventListener('click', handleLeftDocCloseFunc);
                        if (e.target.className !== styles.morePageBox) {
                            self.setState({showLeftMorePagesBox: false});
                        }
                    };
                    if (!this.state.showLeftMorePagesBox) {
                        document.addEventListener('click', handleLeftDocCloseFunc);
                    }
                    this.setState({showLeftMorePagesBox: !this.state.showLeftMorePagesBox});
                } else {
                    let handleRightDocCloseFunc = function(e) {
                        document.removeEventListener('click', handleRightDocCloseFunc);
                        if (e.target.className !== styles.morePageBox) {
                            self.setState({showRightMorePagesBox: false});
                        }
                    };
                    if (!this.state.showLeftMorePagesBox) {
                        document.addEventListener('click', handleRightDocCloseFunc);
                    }
                    this.setState({showRightMorePagesBox: !this.state.showRightMorePagesBox});
                }
            };

            // Set styles
            if (leftSide && this.state.showLeftMorePagesBox) {
                morePagesWrapStyles = classnames(morePagesWrapStyles, styles.show);
                arrowWrapStyles = classnames(arrowWrapStyles, styles.show);
            } else if (!leftSide && this.state.showRightMorePagesBox) {
                morePagesWrapStyles = classnames(morePagesWrapStyles, styles.show);
                arrowWrapStyles = classnames(arrowWrapStyles, styles.show);
            }
            if (morePagesBoxAddedNumber > 0 && morePagesBoxAddedNumber < 4) {
                // If we have: 3 elements the width should be 115
                //             2 elements the width should be 78
                // If we have 1 element the logic should not show ... but the actual number page
                // Therefore, 152 - (X * 37)
                morePagesWrapWidth = morePagesWrapWidth - ((4 - morePagesBoxAddedNumber) * 37);
            }
            if (morePagesBoxAddedNumber === 2) {
                arrowWrapLeftOffset = -3;
            }

            pageBoxes.push(
                <div className={styles.pageBox} onClick={clickHandler} key={Math.random()}>
                    {separateSymbol}
                    <div className={arrowWrapStyles} style={{left: arrowWrapLeftOffset}} />
                    <div className={morePagesWrapStyles} style={{width: morePagesWrapWidth}}>
                        {morePagesBoxes}
                    </div>
                </div>
            );
        };

        // Next & Previous page arrows
        let pushArrowsToPagesBoxes = (pushLeftArrow) => {
            if (pushLeftArrow) {
                let rightArrowClickHandler = () => {
                    if (this.pageNumber - 1 >= 1) { this.handleChange(this.pageNumber - 1); }
                };
                pageBoxes.unshift(
                    <div className={styles.pageBox} onClick={rightArrowClickHandler} key={Math.random()}>
                        {'<'}
                    </div>
                );
            } else {
                let rightArrowClickHandler = () => {
                    if (this.pageNumber + 1 <= this.pagesTotal) { this.handleChange(this.pageNumber + 1); }
                };
                pageBoxes.push(
                    <div className={styles.pageBox} onClick={rightArrowClickHandler} key={Math.random()}>
                        >
                    </div>
                );
            }
        };

        // Logic for adding page numbers
        if (this.pagesTotal <= 9) { // 1 2 3 4 5 6 7 8 9
            if (this.pagesTotal !== 1) { // If we have only one page we do not need pagination
                for (let i = 1; i <= this.pagesTotal; i += 1) {
                    pushBoxToPagesBoxes(i, i === this.pageNumber);
                }
            }
        } else {
            if (this.pageNumber - 4 <= 0 || (this.pageNumber - 4 > 0 && this.pageNumber <= 5)) { // 1 2 3 4 5 6 7 .. 10
                let rightElementsToFill = 7; // 6 is the maximum since if 1 is active 6 lefts to be fill
                for (let i = 1; i <= this.pageNumber; i += 1) {
                    pushBoxToPagesBoxes(i, i === this.pageNumber);
                    rightElementsToFill -= 1;
                }
                for (let i = this.pageNumber + 1; i <= rightElementsToFill + this.pageNumber; i += 1) {
                    pushBoxToPagesBoxes(i);
                }

                pushSeparateSymbol(false, 7, this.pagesTotal);
                pushBoxToPagesBoxes(this.pagesTotal);
            } else if (this.pagesTotal - this.pageNumber <= 4) { // 1 .. 4 5 6 7 8 9 10 ; 1 ... 8 9 10 11 12 ... 16 (10 active)
                let leftElementsToFill = 7; // 6 is the maximum since if Last is active 6 lefts to be fill;
                let lastInsertedNumber;
                for (let i = this.pagesTotal; i >= this.pageNumber; i -= 1) {
                    pushBoxToPagesBoxes(i, i === this.pageNumber);
                    leftElementsToFill -= 1;
                }
                for (let i = this.pageNumber - 1; i >= this.pageNumber - leftElementsToFill; i -= 1) {
                    pushBoxToPagesBoxes(i);
                    lastInsertedNumber = i;
                }

                pushSeparateSymbol(true, lastInsertedNumber, 1);
                pushBoxToPagesBoxes(1);
                pageBoxes = pageBoxes.reverse();
            } else { // 1 .. 5 6 7 8 9 .. 10
                pushBoxToPagesBoxes(1);
                pushSeparateSymbol(true, this.pageNumber - 2, 1);

                let activPageLeftOffset = this.pageNumber - 2;
                let activePageRightOffset = this.pageNumber + 2;
                for (let i = activPageLeftOffset; i <= activePageRightOffset; i += 1) {
                    pushBoxToPagesBoxes(i, i === this.pageNumber);
                }

                pushSeparateSymbol(false, this.pageNumber + 2, this.pagesTotal);
                pushBoxToPagesBoxes(this.pagesTotal);
            }
        }

        // Add Prev & Next Arrow boxes
        if (this.pagesTotal > 1) {
            pushArrowsToPagesBoxes(true);
            pushArrowsToPagesBoxes(false);
        }

        return (
            <div className={styles.pageBoxesWrap}>
                <div className={styles.pageBoxesWrapInnerWrap}>
                    {pageBoxes}
                </div>
            </div>
        );
    }

    renderPageSizeBox() {
        let handlePageSizeDropDrown = (obj) => {
            this.handleChange(1, obj.value);
        };
        let dropdownIconStyles = {
            width: '19px',
            height: '19px',
            top: '100px'
        };
        if (this.props.dropdownIconStyles) {
            dropdownIconStyles = Object.assign(dropdownIconStyles, this.props.dropdownIconStyles);
        }
        return (
            <div className={styles.pageSizeBoxWrap}>
                <div className={styles.totalItemsWrap}>
                    <span className={styles.bold}>{this.recordsTotal}</span> <span className={styles.lighColor}>Items</span>
                </div>
                <div className={styles.itemPerPageDDWrap}>
                     <Dropdown
                       data={this.props.itemsPerPageData.map((x) => { return {key: x, name: x.toString()}; })}
                       defaultSelected={this.pageSize || this.props.itemsPerPageData[0]}
                       onSelect={handlePageSizeDropDrown}
                       cssStyle={dropdownstyles}
                       iconStyles={dropdownIconStyles}
                    />
                </div>
                <div className={styles.perPageWrap}> per page</div>
            </div>
        );
    }

    render() {
        return (
            <div className={styles.paginationWrap}>
                {this.renderPageSwitcher()}
                {this.renderPageBoxes()}
                {this.renderPageSizeBox()}
            </div>
        );
    }
};

AdvancedPagination.propTypes = {
    /**
     * pageNumber
     * pageSize
     * recordsTotal
     * pagesTotal - not required
    */
    pagination: PropTypes.object.isRequired, // immutable object,
    itemsPerPageData: PropTypes.arrayOf(PropTypes.number),
    dropdownIconStyles: PropTypes.object,
    onUpdate: PropTypes.func
};

AdvancedPagination.defaultProps = {
    itemsPerPageData: [25, 50, 100, 150, 200, 250, 500],
    onUpdate: () => {}
};

export default AdvancedPagination;
