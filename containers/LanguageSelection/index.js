import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.css';
import { changeLanguage } from '../LoginForm/actions';

const languages = [
    { key: 'en', name: 'English' },
    { key: 'es', name: 'Español' }
];

class LanguageSelection extends Component {
    render() {
        const { selectedLanguage } = this.props;

        if (!selectedLanguage) return <div />;

        return (
            <div className={styles.wrap}>
                {languages.map((lang) => (
                    <div
                        key={lang.key}
                        className={
                            lang.key === selectedLanguage
                                ? `${styles.langItem} ${styles.selected}`
                                : styles.langItem
                        }
                        onClick={() => this.props.changeLanguage({selectedLanguage: lang.key})}
                    >
                        {lang.name}
                    </div>
                ))}
            </div>
        );
    }
}

export default connect(
    ({ login }) => ({
        selectedLanguage: login.get('selectedLanguage')
    }),
    { changeLanguage }
)(LanguageSelection);

LanguageSelection.propTypes = {
    selectedLanguage: PropTypes.string,
    changeLanguage: PropTypes.func
};
