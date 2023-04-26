import React from 'react';
import PropTypes from 'prop-types';
import types from './types.js';
import immutable from 'immutable';
import Textt from '../Text';
import Text from './sections/Text';
import Heading from './sections/Heading';
import Image from './sections/Image';
import LinkButton from './sections/Link';
import CircularProgress from 'material-ui/CircularProgress';

import classnames from 'classnames';
import style from './style.css';

const AttributesSection = (props) => {
    const { checked, selected, isInfoLoading, multipleItemNames, checkedMapKey, selectedSourceData, singleItemName, hasPermissions } = props;

    const getCheckedItemsText = () => {
        const multipleItemNamesString = multipleItemNames !== '' ? multipleItemNames : singleItemName + 's';
        const itemPlurizationName = checked.size === 1 ? singleItemName : multipleItemNamesString;

        let itemNamesAsString = '';
        if (checked.size < 10) {
            itemNamesAsString = checked.map((item, index) => {
                return (
                    <div key={index} className={style.checkedItemProp}>
                        {item.get(checkedMapKey)}
                        {(index + 1) < checked.size && ','}
                    </div>
                );
            });
        }

        return (
            <div className={style.checkedWrap}>
                <div className={style.selectedAndCheckeLabel}><Textt>Checked</Textt></div>
                <div className={style.innerWrap}>
                    <div className={style.bold}><Textt>You have checked</Textt>:</div>
                    <div><span className={style.checkedItemsNumber}>{checked.size}</span> <Textt>{itemPlurizationName}</Textt></div>
                    <div className={style.checkedItemsWrap}>{itemNamesAsString}</div>
                </div>
            </div>
        );
    };

    const getSelectedInfo = () => {
        return (
            <div>
                <div className={style.selectedAndCheckeLabel}><Textt>Selected</Textt></div>
                <div className={style.innerWrap}>
                    {selectedSourceData.map((sourceData, i) => {
                        return (
                            <div key={i}>
                                <div key={i}>
                                    {renderSelectedRow(sourceData)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderSelectedRow = (sourceData) => {
        let value;

        if (Array.isArray(sourceData.key)) {
            value = selected.getIn(sourceData.key);
        } else {
            value = selected.get(sourceData.key);
        }

        if (!sourceData.hideIfNotSet || (sourceData.hideIfNotSet && value)) {
            switch (sourceData.type) {
                case types.heading:
                    return <Heading value={value} styles={sourceData.styles} />;
                case types.image:
                    return <Image src={value} defaultSrc={sourceData.defaultSrc} />;
                case types.link:
                    return <LinkButton text={sourceData.name} url={value} onClick={sourceData.onClick} />;
                case types.header:
                    return <Heading value={sourceData.name} styles={sourceData.styles} />;
                default:
                    return <Text
                        title={sourceData.name}
                        value={value}
                        valueShouldBeMapped={sourceData.valueShouldBeMapped}
                        mapKey={sourceData.mapKey}
                    />;
            }
        }
    };

    const renderChecked = () => {
        return (
            <div className={style.wrap}>
                {getCheckedItemsText()}
            </div>
        );
    };

    const renderProgress = () => {
        return (
            <div className={classnames(style.wrap, style.progressWrap)}>
                <div className={style.renderProgress}>
                    <CircularProgress size={45} />
                </div>
            </div>
        );
    };

    const renderSelected = () => {
        return (
            <div className={style.wrap}>
                {getSelectedInfo()}
            </div>
        );
    };

    const renderCheckedAndSelected = () => {
        return (
            <div className={style.wrap}>
                {getCheckedItemsText()}

                <div className={style.selectedAndCheckedSelectedWrap}>
                    {getSelectedInfo()}
                </div>
            </div>
        );
    };

    const renderEmpty = () => {
        return (
            <div className={style.wrap}>
                <div className={classnames(style.noSelectedData, style.innerWrap)}>
                    <Textt>Please select an</Textt> <Textt>{singleItemName}</Textt> <Textt>from the table to see basic info</Textt>.
                </div>
            </div>
        );
    };

    const renderNoPermissions = () => {
        return (
            <div className={style.wrap}>
                <div className={classnames(style.noSelectedData, style.innerWrap)}>
                    <Textt>You have no permissions to view this information</Textt>.
                </div>
            </div>
        );
    };

    if (!hasPermissions) {
        return renderNoPermissions();
    }
    if (checked.size > 0 && selected.size > 0) {
        return renderCheckedAndSelected();
    } else if (checked.size > 0) {
        return renderChecked();
    } else if (isInfoLoading) {
        return renderProgress();
    } else if (selected.size > 0) {
        return renderSelected();
    } else {
        return renderEmpty();
    }
};

AttributesSection.propTypes = {
    selectedSourceData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
            type: PropTypes.oneOf([types.text, types.heading, types.image, types.link, types.header]),
            styles: PropTypes.object
        })
    ).isRequired,
    selected: PropTypes.object.isRequired, // immutable
    checked: PropTypes.object.isRequired, // immutable
    singleItemName: PropTypes.string,
    multipleItemNames: PropTypes.string,
    checkedMapKey: PropTypes.string,
    isInfoLoading: PropTypes.bool,
    hasPermissions: PropTypes.bool
};

AttributesSection.defaultProps = {
    selected: immutable.Map({}),
    singleItemName: '',
    multipleItemNames: '',
    checkedMapKey: 'name',
    isInfoLoading: false,
    hasPermissions: true
};

export default AttributesSection;
