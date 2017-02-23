export const isIPValid = (IPString) => {
    let rgx = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    if (IPString.match(rgx)) {
        return true;
    } else {
        return false;
    }
};

export function parseIPToDecimal(IPString) {
    if (!IPString) {
        return -1;
    }
    let parts = IPString.split('.');
    if (parts.length === 4) {
        return parseInt(parts.pop()) + parts.reduce((sum, currValue) => {
            return (sum + parseInt(currValue)) * 256;
        }, 0);
    } else {
        return -1;
    }
};

export function compareIpRanges(ipFrom, ipTo) {
    if (isIPValid(ipFrom) && isIPValid(ipTo)) {
        let ipFromDec = parseIPToDecimal(ipFrom);
        let ipToDec = parseIPToDecimal(ipTo);
        if (ipFromDec <= ipToDec) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
