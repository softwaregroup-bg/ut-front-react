import React from 'react';
import { storiesOf } from '@kadira/storybook';
import immutable from 'immutable';
import AttributesSection from '../../components/AttributesSection';
import types from '../../components/AttributesSection/types';
import MaterialUILayout from '../../components/MaterialUILayout';

const selectedSourceKeys = [
    { key: ['person', 'imageSrc'], type: types.image },
    { key: ['identifier'], type: types.heading, styles: { color: '#E93591', textTransform: 'none' } },
    { name: 'First name', key: ['person', 'firstName'] },
    { name: 'Last name', key: ['person', 'lastName'] },
    { name: 'Email', key: ['email', '0', 'value'] },
    { name: 'Phone', key: ['phone', '0', 'phoneNumber'] },
    { name: 'Branches', key: ['memberOf'], valueShouldBeMapped: true, mapKey: 'organizationName' },
    { name: 'Roles', key: ['roles'], valueShouldBeMapped: true, mapKey: 'name' },
    { name: 'See user details', key: ['url'], type: types.link }
];

storiesOf('AttributesSection', module)
    .add('Default', () => (
        <AttributesSection
            selectedSourceData={selectedSourceKeys}
            singleItemName={'user'}
            multipleItemNames={''}
            selected={emptyImmutableMap}
            checked={emptyImmutableList}
            checkedMapKey={'userName'}
            isInfoLoading={false}
        >
            Content
    </AttributesSection>
    ))
    .add('one checked', () => (
        <AttributesSection
            selectedSourceData={selectedSourceKeys}
            singleItemName={'user'}
            multipleItemNames={''}
            selected={emptyImmutableMap}
            checked={immutable.List([firstChecked])}
            checkedMapKey={'userName'}
            isInfoLoading={false}
        >
            Content
    </AttributesSection>
    ))
    .add('two checked', () => (
        <div style={{ width: '300px' }}>
            <AttributesSection
                selectedSourceData={selectedSourceKeys}
                singleItemName={'user'}
                multipleItemNames={''}
                selected={emptyImmutableMap}
                checked={twoChecked}
                checkedMapKey={'userName'}
                isInfoLoading={false}
            />
        </div>
    ))
    .add('three checked', () => (
        <div style={{ width: '300px' }}>
            <AttributesSection
                selectedSourceData={selectedSourceKeys}
                singleItemName={'user'}
                multipleItemNames={''}
                selected={emptyImmutableMap}
                checked={twoChecked}
                checkedMapKey={'userName'}
                isInfoLoading={false}
            />
        </div>
    ))

    .add('only selected', () => (
        <div style={{ width: '300px' }}>
            <AttributesSection
                selectedSourceData={selectedSourceKeys}
                singleItemName={'user'}
                multipleItemNames={''}
                selected={selected}
                checked={emptyImmutableList}
                checkedMapKey={'userName'}
                isInfoLoading={false}
            />
        </div>
    ))
    .add('selected and checked', () => (
        <div style={{ width: '300px' }}>
            <AttributesSection
                selectedSourceData={selectedSourceKeys}
                singleItemName={'user'}
                multipleItemNames={''}
                selected={selected}
                checked={twoChecked}
                checkedMapKey={'userName'}
                isInfoLoading={false}
            />
        </div>
    ))
    .add('loading', () => (
        <MaterialUILayout>
            <div style={{ width: '300px' }}>
                <AttributesSection
                    selectedSourceData={selectedSourceKeys}
                    singleItemName={'user'}
                    multipleItemNames={''}
                    selected={emptyImmutableMap}
                    checked={emptyImmutableList}
                    checkedMapKey={'userName'}
                    isInfoLoading
                />
            </div>
        </MaterialUILayout>
    ));

const emptyImmutableList = immutable.List([]);
const emptyImmutableMap = immutable.Map({});

const firstChecked = immutable.Map({
    actorId: '1045',
    branches: 'Cote d\'Ivoire',
    firstName: 'CoteDIvoire User',
    isApproved: false,
    isEnabled: true,
    lastName: 'Admin',
    roles: 'Cote d\'Ivoire UserMaker',
    url: '/user/users/CoteDIvoireMakerUser/1045',
    userName: 'CoteDIvoireMakerUser'
});

const secondChecked = immutable.Map({
    actorId: '1054',
    branches: 'Mali',
    firstName: 'Mali User',
    isApproved: false,
    isEnabled: true,
    lastName: 'Checker Admin',
    roles: 'Mali_UserChecker',
    url: '/user/users/MaliCheckerUser/1054',
    userName: 'MaliCheckerUser'
});

const twoChecked = immutable.List([
    firstChecked,
    secondChecked
]);

const selected = immutable.fromJS({
    'identifier': 'ChinaMakerUser',
    'email': [
        {
            'value': 'test email'
        }
    ],
    'phone': [
        {
            'phoneNumber': 'phone number'
        }
    ],
    'person': {
        'imageSrc': 'http://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg',
        'firstName': 'China User',
        'lastName': 'Admin'
    },
    'url': '/user/users/ChinaMakerUser/1047',
    'roles': [{
        'isAssigned': 1,
        name: 'China_UserMaker',
        roleId: '1041'
    }],
    'memberOf': [{
        object: '1028',
        organizationName: 'China'
    }]
});

// const allUsers = [{
//     'actorId': '1021',
//     'userName': 'bo',
//     'firstName': 'Back',
//     'lastName': 'Office',
//     'roles': 'BO',
//     'branches': 'Microcred',
//     'isEnabled': true,
//     'isApproved': false,
//     'url': '/user/users/bo/1021'},
//     {
//         'actorId': '1048',
//         'userName': 'ChinaCheckerUser',
//         'firstName': 'China User',
//         'lastName': 'Checker Admin',
//         'roles': 'China_UserChecker',
//         'branches': 'China',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/ChinaCheckerUser/1048'},
//     {
//         'actorId': '1047',
//         'userName': 'ChinaMakerUser',
//         'firstName': 'China User',
//         'lastName': 'Admin',
//         'roles': 'China_UserMaker',
//         'branches': 'China',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/ChinaMakerUser/1047'},
//     {
//         'actorId': '1019',
//         'userName': 'contentAdmin',
//         'firstName': 'User',
//         'lastName': 'Admin',
//         'roles': 'MC_ContentAdmin',
//         'branches': 'Microcred',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/contentAdmin/1019'},
//     {
//         'actorId': '1046',
//         'userName': 'CoteDIvoireCheckerUser',
//         'firstName': 'CoteDIvoire User',
//         'lastName': 'Checker Admin',
//         'roles': 'Cote d\'Ivoire UserChecker',
//         'branches': 'Cote d\'Ivoire',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/CoteDIvoireCheckerUser/1046'},
//     {
//         'actorId': '1045',
//         'userName': 'CoteDIvoireMakerUser',
//         'firstName': 'CoteDIvoire User',
//         'lastName': 'Admin',
//         'roles': 'Cote d\'Ivoire UserMaker',
//         'branches': 'Cote d\'Ivoire',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/CoteDIvoireMakerUser/1045'},
//     {
//         'actorId': '1020',
//         'userName': 'cs',
//         'firstName': 'Customer',
//         'lastName': 'Service',
//         'roles': 'CS',
//         'branches': 'Microcred',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/cs/1020'},
//     {
//         'actorId': '1056',
//         'userName': 'MadagascarCheckerUser',
//         'firstName': 'Madagascar User',
//         'lastName': 'Checker Admin',
//         'roles': 'Madagascar_UserChecker',
//         'branches': 'Madagascar',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/MadagascarCheckerUser/1056'},
//     {
//         'actorId': '1055',
//         'userName': 'MadagascarMakerUser',
//         'firstName': 'Madagascar User',
//         'lastName': 'Admin',
//         'roles': 'Madagascar_UserMaker',
//         'branches': 'Madagascar',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/MadagascarMakerUser/1055'},
//     {
//         'actorId': '1054',
//         'userName': 'MaliCheckerUser',
//         'firstName': 'Mali User',
//         'lastName': 'Checker Admin',
//         'roles': 'Mali_UserChecker',
//         'branches': 'Mali',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/MaliCheckerUser/1054'},
//     {
//         'actorId': '1053',
//         'userName': 'MaliMakerUser',
//         'firstName': 'Mali User',
//         'lastName': 'Admin',
//         'roles': 'Mali_UserMaker',
//         'branches': 'Mali',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/MaliMakerUser/1053'},
//     {
//         'actorId': '1050',
//         'userName': 'NigeriaCheckerUser',
//         'firstName': 'Nigeria User',
//         'lastName': 'Checker Admin',
//         'roles': 'Nigeria_UserChecker',
//         'branches': 'Nigeria',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/NigeriaCheckerUser/1050'},
//     {
//         'actorId': '1049',
//         'userName': 'NigeriaMakerUser',
//         'firstName': 'Nigeria User',
//         'lastName': 'Admin',
//         'roles': 'Nigeria_UserMaker',
//         'branches': 'Nigeria',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/NigeriaMakerUser/1049'},
//     {
//         'actorId': '1000',
//         'userName': 'sa',
//         'firstName': 'Super',
//         'lastName': 'Admin',
//         'roles': 'N/A',
//         'branches': 'Microcred',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/sa/1000'},
//     {
//         'actorId': '1044',
//         'userName': 'SenegalCheckerUser',
//         'firstName': 'Senegal User',
//         'lastName': 'Checker Admin',
//         'roles': 'Senegal_UserChecker',
//         'branches': 'Senegal',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/SenegalCheckerUser/1044'},
//     {
//         'actorId': '1043',
//         'userName': 'SenegalMakerUser',
//         'firstName': 'Senegal User',
//         'lastName': 'Admin',
//         'roles': 'Senegal_UserMaker',
//         'branches': 'Senegal',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/SenegalMakerUser/1043'},
//     {
//         'actorId': '1052',
//         'userName': 'TunisiaCheckerUser',
//         'firstName': 'Tunisia User',
//         'lastName': 'Checker Admin',
//         'roles': 'Tunisia_UserChecker',
//         'branches': 'Tunisia',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/TunisiaCheckerUser/1052'},
//     {
//         'actorId': '1051',
//         'userName': 'TunisiaMakerUser',
//         'firstName': 'Tunisia User',
//         'lastName': 'Admin',
//         'roles': 'Tunisia_UserMaker',
//         'branches': 'Tunisia',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/TunisiaMakerUser/1051'},
//     {
//         'actorId': '1017',
//         'userName': 'userCheckerAdmin',
//         'firstName': 'User Checker',
//         'lastName': 'Admin',
//         'roles': 'MC_UserCheckerAdmin',
//         'branches': 'Microcred',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/userCheckerAdmin/1017'},
//     {
//         'actorId': '1016',
//         'userName': 'userMakerAdmin',
//         'firstName': 'User Maker',
//         'lastName': 'Admin',
//         'roles': 'MC_UserMakerAdmin',
//         'branches': 'Microcred',
//         'isEnabled': true,
//         'isApproved': false,
//         'url': '/user/users/userMakerAdmin/1016'
//     }];
