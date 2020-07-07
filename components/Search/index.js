import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import style from './style.css';

const Search = ({ wrapper, searchInput, searchBtn, search }) => {
    const classesWrapper = classnames(style.searchbar, wrapper.className);
    const classesInput = classnames(style.searchInput, searchInput.className);
    const classesButton = classnames(style.searchButton, searchBtn.className);
    let input;
    function submit(e) {
        e.preventDefault();
        if (!input.value.trim()) {
            return;
        }
        search(input.value);
    }
    return (
        <div {...wrapper} className={classesWrapper}>
            <form onSubmit={submit}>
                <input type='text' ref={function(node) { input = node; }} className={classesInput} {...searchInput} />
                <button type='submit' className={classesButton} {...searchBtn} onClick={searchBtn.onSubmit}>{searchBtn.value}</button>
            </form>
        </div>
    );
};

Search.propTypes = {
    wrapper: PropTypes.object,
    searchInput: PropTypes.shape({
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired
    }),
    searchBtn: PropTypes.shape({
        value: PropTypes.any,
        className: PropTypes.string,
        onSubmit: PropTypes.func.isRequired
    }),
    search: PropTypes.func
};

Search.defaultProps = {
    wrapper: {
        className: ''
    },
    searchInput: {},
    searchBtn: {}
};

export default Search;
