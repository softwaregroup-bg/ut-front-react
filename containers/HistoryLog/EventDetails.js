import React, {Component, PropTypes} from 'react';
import Input from '../../components/Input';
import classnames from 'classnames';
import TextArea from '../../components/Input/TextArea';
import style from './style.css';
import {convertDate, getTimeZone, getTimeZoneByOffset, formatISODate, convertUTCtoLocale} from './timeZone';
import inputStyle from '../../components/Input/style.css';
const INVALID_DATE = 'Invalid Date';
const offset = new Date().getTimezoneOffset();
export class EventDetails extends Component {
    render() {
        if (Object.keys(this.props.eventDetails).length === 0) {
            return (
                <div className={style.detailsWrap}>
                    <div className={style.notify}>
                        No Event is available for this record
                    </div>
                </div>
            );
        }
        let {auditId, globalId, eventClass, actionId, channel,
            severityLevel, auditDate, latitude, longitude, timeZone, actorId, userName, businessUnitId,
            businessUnit, eventOutcome, sourceIp, destinationIp, localPort, deviceId, utService, utVersion,
            os, hostName, machineName, errorMessage, description} = this.props.eventDetails;
        auditDate = new Date(auditDate);
        let userDate = auditDate && timeZone && getTimeZone(timeZone)
                      ? convertDate(auditDate, timeZone) : null;
        severityLevel = severityLevel ? severityLevel[0].toUpperCase() + severityLevel.substr(1) : severityLevel;
        eventOutcome = eventOutcome ? eventOutcome[0].toUpperCase() + eventOutcome.substr(1) : severityLevel;
        return (
            <div className={style.detailsWrap}>
                <div className={style.row}>
                    <Input value={auditId} label='Audit Entry ID' readonly />
                </div>
                <div className={style.row}>
                    <Input value={globalId} label='Event GUID' readonly />
                </div>
                <div className={style.row}>
                    <Input value={eventClass} label='Event Class' readonly />
                </div>
                <div className={style.row}>
                    <Input value={actionId} label='Event Code' readonly />
                </div>
                <div className={style.row}>
                    <Input value={description} label='Event Description' readonly />
                </div>
                <div className={style.row}>
                    <Input value={channel} label='Channel' readonly />
                </div>
                <div className={style.row}>
                    <Input value={actorId} label='User ID' readonly />
                </div>
                <div className={style.row}>
                    <Input value={userName} label='Username' readonly />
                </div>
                <div className={style.row}>
                    <Input value={businessUnitId} label='Business Unit ID' readonly />
                </div>
                <div className={style.row}>
                    <Input value={businessUnit} label='Business Unit Name' readonly />
                </div>
                <div className={style.row}>
                    <Input value={auditDate.toString() !== INVALID_DATE
                    ? formatISODate(convertUTCtoLocale(auditDate)) + ' UTC' + getTimeZoneByOffset(offset).value : ''} label='Date and Time' readonly />
                </div>
                <div className={style.row}>
                    <Input value={userDate ? formatISODate(userDate) + ' UTC' + getTimeZone(timeZone).value : 'N/A'}
                      label='Local Date and Time' readonly />
                </div>
                <div className={style.row}>
                    <Input value={eventOutcome} label='Success/Failure' readonly />
                </div>
                <div className={style.row}>
                    <Input value={sourceIp} label='Source IP Address' readonly />
                </div>
                <div className={style.row}>
                    <Input value={destinationIp} label='Destination IP Address' readonly />
                </div>
                <div className={style.row}>
                    <Input value={localPort} label='Destination Port' readonly />
                </div>
                <div className={style.row}>
                    <Input value={deviceId} label='Device ID' readonly />
                </div>
                <div className={style.row}>
                    <div className={inputStyle.outerWrap}>
                        <div>
                            {'GeoLocation'}
                        </div>
                        <div className={classnames(inputStyle.inputWrap)}>
                          <input
                            readOnly
                            className={classnames(inputStyle.input, style.inputInnerWrapper)}
                            value={latitude && longitude ? [latitude, longitude].join(',') : ''} />
                            <div className={classnames(style.inputInnerActionWrapper, style.activeLink)}>
                                {
                                    latitude && longitude
                                    ? (<a target={'_blank'} href={'https://www.google.com/maps?q=' + [latitude, longitude].join(',')}>View on Map</a>)
                                    : (<span>View on Map</span>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.row}>
                    <Input value={severityLevel} label='Severity Level' readonly />
                </div>
                <div className={style.row}>
                    <Input value={utService} label='UT Service Name' readonly />
                </div>
                <div className={style.row}>
                    <Input value={utVersion} label='UT Service Version' readonly />
                </div>
                <div className={style.row}>
                    <Input value={os} label='Server OS Version' readonly />
                </div>
                <div className={style.row}>
                    <Input value={hostName} label='Domain name' readonly />
                </div>
                <div className={style.row}>
                    <Input value={machineName} label='Server Machine Name' readonly />
                </div>
                { eventOutcome && eventOutcome.toLowerCase() === 'failure'
                  ? (<div className={style.row}>
                        <TextArea value={errorMessage} label='Error Message' readonly />
                     </div>) : null }
            </div>
        );
    }
}

EventDetails.propTypes = {
    eventDetails: PropTypes.object.isRequired
};

export default EventDetails;
