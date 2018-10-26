import React, { PropTypes } from 'react';
import style from './style.css';
import { Link } from 'react-router';

Sidebar.propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.node.isRequired,
        linkTo: PropTypes.string.isRequired,
        postFix: PropTypes.node
    })).isRequired
};

export default function Sidebar({ menuItems }) {
    return (
        <div className={style.menuWrapper}>
            <div className={style.menu}>
                <ul>
                    {menuItems.map((menuItem) =>
                        <li key={menuItem.id}>
                            <Link to={menuItem.linkTo} activeClassName={style.active}>
                                {menuItem.title}
                                {menuItem.postFix != null && <span className={style.postFix}>({menuItem.postFix})</span>}
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
