import React from 'react';
import { useDispatch } from 'react-redux';

import Text from '../../components/Text';
import { coreLicenseCheck } from './actions';

const LicenseWarning = () => {
    const [dismissed, setDismissed] = React.useState(false);

    const [licenseInfo, setLicenseInfo] = React.useState(null);
    const dispatch = useDispatch();
    React.useEffect(() => {
        async function licenseCheck() {
            const response = await dispatch(coreLicenseCheck({}));
            if (response?.result) {
                setLicenseInfo(response.result);
            }
        }
        licenseCheck();
    }, [dispatch]);

    if (licenseInfo?.expired) {
        return (
            <div
                style={{
                    color: 'white',
                    backgroundColor: 'red',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px 24px 8px 8px'
                }}
            >
                <Text>
                    Your license has expired. Please contact your administrator.
                </Text>
            </div>
        );
    } else if (!!licenseInfo && licenseInfo.daysLeft < 30 && !dismissed) {
        const textTemplate = 'Your license will expire in {daysLeft} days. Please contact your administrator.';
        return (
            <div
                style={{
                    color: 'white',
                    backgroundColor: 'orange',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    position: 'relative',
                    padding: '8px 24px 8px 8px'
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
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    title='Dismiss'
                >
                    ×
                </button>
                <Text params={{ daysLeft: licenseInfo.daysLeft }}>
                    {textTemplate}
                </Text>
            </div>
        );
    }
    return null;
};

LicenseWarning.propTypes = {};

export default LicenseWarning;
