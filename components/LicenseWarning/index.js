import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Text';

const LicenseWarning = ({ checked, expired, daysLeft }) => {
    const [dismissed, setDismissed] = React.useState(false);

    if (expired) {
        return (
            <div
                style={{
                    color: 'red',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                <Text>
                    Your license has expired. Please contact your administrator.
                </Text>
            </div>
        );
    } else if (checked && daysLeft < 30 && !dismissed) {
        return (
            <div
                style={{
                    color: 'orange',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    position: 'relative',
                    padding: '8px 24px 8px 8px',
                }}
            >
                <button
                    onClick={() => setDismissed(true)}
                    style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'orange',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                    title='Dismiss'
                >
                    ×
                </button>
                <Text>
                    Your license will expire in {daysLeft} days. Please contact
                    your administrator.
                </Text>
            </div>
        );
    }
    return null;
};

LicenseWarning.propTypes = {
    checked: PropTypes.bool,
    expired: PropTypes.bool,
    daysLeft: PropTypes.number
};

export default LicenseWarning;
