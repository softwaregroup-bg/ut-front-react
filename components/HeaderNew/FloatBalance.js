import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import Text from '../../components/Text';
import { connect } from 'react-redux';

const FloatBalance = props => {
    return (
        <>
            {
                props.portalName === 'AgencyBanking' && <div className={styles.profileInfo}>
                    <div className={styles.floatBalance}>
                        <Text>
                            Float Balance
                        </Text>
                        <Text>
                            {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GHS' }).format('25000')}
                        </Text>
                    </div>
                </div>
            }
        </>
    );
};

FloatBalance.propTypes = {
    portalName: PropTypes.string,
    balance: PropTypes.string
};

function mapStateToProps({login}) {
    // const {} = reduxState;
    return {
        balance: login?.getIn?.(['result', 'walletAccounts'])?.find?.(wallet => {
            return wallet.get('name') === 'floatAccount';
        })?.get?.('balance')
    };
}

export default connect(mapStateToProps, {})(FloatBalance);
