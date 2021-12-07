import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './style.css';

Pagination.propTypes = {
    currentPage: PropTypes.number,
    visiblePages: PropTypes.number,
    totalPages: PropTypes.number,
    onClick: PropTypes.func
};

Pagination.defaultProps = {
    currentPage: 1,
    visiblePages: 10,
    totalPages: 1,
    onClick: function() {}
};

export default function Pagination({ currentPage, visiblePages, totalPages, onClick }) {
    const otherPages = visiblePages - 1;
    const maxExpandRight = Math.ceil(otherPages / 2);
    const maxExpandLeft = otherPages - maxExpandRight;
    const right = Math.min(totalPages - currentPage, maxExpandRight);
    const left = Math.min(currentPage - 1, maxExpandLeft);
    const remainingExpand = otherPages - (right + left);
    const startPage = Math.max(1, currentPage - left - remainingExpand);
    const endPage = Math.min(totalPages, currentPage + right + remainingExpand);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        const className = currentPage === i ? style.active : '';
        const click = function() { onClick(i); };
        pages.push(
            <span onClick={click} key={i} className={classnames(style.page, className)}>
                {i}
            </span>
        );
    }

    const createOnClick = (page) => () => onClick(page);
    const notOnFirstPage = currentPage !== 1;
    const notOnLastPage = currentPage !== totalPages;

    return (
        <div className={style.pagination}>
            <div className={classnames('f10', style.controls)}>
                <span key='back' className={style.back}>
                    <span onClick={notOnFirstPage && createOnClick(1)} className={classnames(style.page, style.firstPage, style.pageNav, notOnFirstPage ? undefined : style.pageNavInactive)} />
                    <span onClick={notOnFirstPage && createOnClick(currentPage - 1)} className={classnames(style.page, style.previousPage, style.pageNav, notOnFirstPage ? undefined : style.pageNavInactive)} />
                </span>
                {pages}
                <span key='forward' className={style.forward}>
                    <span onClick={notOnLastPage && createOnClick(currentPage + 1)} className={classnames(style.page, style.nextPage, style.pageNav, notOnLastPage ? undefined : style.pageNavInactive)} />
                    <span onClick={notOnLastPage && createOnClick(totalPages)} className={classnames(style.page, style.lastPage, style.pageNav, notOnLastPage ? undefined : style.pageNavInactive)} />
                </span>
            </div>
        </div>
    );
}
