const timeZones = [
    {key: '000', value: '-12:00'},
    {key: '001', value: '-11:00'},
    {key: '002', value: '-10:00'},
    {key: '003', value: '-09:00'},
    {key: '004', value: '-08:00'},
    {key: '010', value: '-07:00'},
    {key: '013', value: '-07:00'},
    {key: '015', value: '-07:00'},
    {key: '020', value: '-06:00'},
    {key: '025', value: '-06:00'},
    {key: '030', value: '-06:00'},
    {key: '033', value: '-06:00'},
    {key: '035', value: '-05:00'},
    {key: '040', value: '-05:00'},
    {key: '045', value: '-05:00'},
    {key: '050', value: '-04:00'},
    {key: '055', value: '-04:00'},
    {key: '056', value: '-04:00'},
    {key: '060', value: '-03:30'},
    {key: '065', value: '-03:00'},
    {key: '070', value: '-03:00'},
    {key: '073', value: '-03:00'},
    {key: '075', value: '-02:00'},
    {key: '080', value: '-01:00'},
    {key: '083', value: '-01:00'},
    {key: '085', value: '+00:00'},
    {key: '090', value: '+00:00'},
    {key: '095', value: '+01:00'},
    {key: '100', value: '+01:00'},
    {key: '105', value: '+01:00'},
    {key: '110', value: '+01:00'},
    {key: '113', value: '+01:00'},
    {key: '115', value: '+02:00'},
    {key: '120', value: '+02:00'},
    {key: '125', value: '+02:00'},
    {key: '130', value: '+02:00'},
    {key: '135', value: '+02:00'},
    {key: '140', value: '+02:00'},
    {key: '145', value: '+03:00'},
    {key: '150', value: '+03:00'},
    {key: '155', value: '+03:00'},
    {key: '158', value: '+03:00'},
    {key: '160', value: '+03:30'},
    {key: '165', value: '+04:00'},
    {key: '170', value: '+04:00'},
    {key: '175', value: '+04:30'},
    {key: '180', value: '+05:00'},
    {key: '185', value: '+05:00'},
    {key: '190', value: '+05:30'},
    {key: '193', value: '+05:45'},
    {key: '195', value: '+06:00'},
    {key: '200', value: '+06:00'},
    {key: '201', value: '+06:00'},
    {key: '203', value: '+06:30'},
    {key: '205', value: '+07:00'},
    {key: '207', value: '+07:00'},
    {key: '210', value: '+08:00'},
    {key: '215', value: '+08:00'},
    {key: '220', value: '+08:00'},
    {key: '225', value: '+08:00'},
    {key: '227', value: '+08:00'},
    {key: '230', value: '+09:00'},
    {key: '235', value: '+09:00'},
    {key: '240', value: '+09:00'},
    {key: '245', value: '+09:30'},
    {key: '250', value: '+09:30'},
    {key: '255', value: '+10:00'},
    {key: '260', value: '+10:00'},
    {key: '265', value: '+10:00'},
    {key: '270', value: '+10:00'},
    {key: '275', value: '+10:00'},
    {key: '280', value: '+11:00'},
    {key: '285', value: '+12:00'},
    {key: '290', value: '+12:00'},
    {key: '300', value: '+13:00'}
];

module.exports = {
    timeZones,
    convertDate: function(date, timeZoneCode) {
        var timeZone = (timeZones.find(function(tz) {
            return parseInt(tz.key) === parseInt(timeZoneCode);
        }) || {}).value;
        if (date instanceof Date && timeZone) {
            var minutes = timeZone.split(':')[0] * 60 + parseInt(timeZone[0] + timeZone.split(':')[1]);
            return new Date(date.getTime() + minutes * 60 * 1000);
        } else {
            return null;
        }
    },
    getTimeZone: function(timeZoneCode) {
        return (timeZones.find(function(tz) {
            return parseInt(tz.key) === parseInt(timeZoneCode);
        }) || {});
    },
    getTimeZoneByOffset: function(offset) {
        return (timeZones.find(function(tz) {
            var timeZone = tz.value;
            var calcOffset = timeZone.split(':')[0] * 60 + parseInt(timeZone[0] + timeZone.split(':')[1]);
            return ~(offset - 1) === calcOffset;
        }) || {});
    },
    formatDate: function(date) {
        if (date instanceof Date) {
            var isoString = date.toISOString();
            return [isoString.substr(0, 10), isoString.substr(11, 12)].join(', ');    
        }
        return null;
    },
    convertUTCtoLocale: function(utcDate) {
        utcDate.setMinutes(utcDate.getMinutes() - utcDate.getTimezoneOffset());
        return utcDate;
    },
    formatISODate: function(date) {
        if (date instanceof Date) {
            var isoString = date.toISOString();
            return [isoString.substr(0, 10), isoString.substr(11, 12)].join(', ');
        }
        return null;
    }
};
