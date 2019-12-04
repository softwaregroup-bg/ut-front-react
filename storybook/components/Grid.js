import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import immutable from 'immutable';
import Grid from '../../components/Grid';
import Header from '../../components/Grid/Header';
import Table from '../../components/Grid/Table';
import HeaderCell from '../../components/Grid/HeaderCell';
import Row from '../../components/Grid/Row';

storiesOf('Grid', module)
    .add('Default', () => (
        <Grid
            showTableHead
            columns={tableColumns}
            onSort={testFunc}
            onRefresh={testFunc}
            onSelect={testFunc}
            rows={allUsers}
            mapColumn={mapColumn}
        />
    ))
    .add('Custom', () => (
        <Grid
            canCheck
            showTableHead
            columns={tableColumns}
            sortableColumns={sortableColumns}
            linkableColumns={linkableColumns}
            onSort={testFunc}
            onRefresh={testFunc}
            onSelect={testFunc}
            onCheck={testFunc}
            rows={allUsers}
            mapColumn={mapColumn}
            trStyles={{ backgroundColor: 'lightskyblue' }}
            tdStyles={tdStyles}
            thStyles={thStyles}
        />
    ))
    .add('Table', () => (
        <Table>
            <Header columns={tableColumns} thStyles={thStyles} />
        </Table>
    ))
    .add('Header', () => (
        <Table>
            <Header
                columns={tableColumns}
                canCheck
                sortable={[true, true]}
                linkableColumns={linkableColumns}
                onSort={testFunc}
                onRefresh={testFunc}
                onSelect={testFunc}
                onCheck={testFunc}
                rows={allUsers}
                mapColumn={mapColumn}
                trStyles={{ backgroundColor: 'lightskyblue' }}
                tdStyles={tdStyles}
                thStyles={thStyles}
            />
        </Table>
    ))
    .add('HeaderCell', () => (
        <Table>
            <thead>
                <tr>
                    <HeaderCell
                        name='sort desc cell'
                        canSort
                        onSort={testFunc}
                        sortState={2}
                        styles={thStyles[0]}
                    />
                    <HeaderCell
                        name='sort asc cell'
                        canSort
                        onSort={testFunc}
                        sortState={1}
                        styles={thStyles[0]}
                    />
                </tr>
            </thead>
        </Table>
    ))
    .add('Row', () => (
        <Table>
            <tbody>
                <Row
                    linkableColumns={linkableColumns}
                    columns={tableColumns}
                    checked
                    onSelect={testFunc}
                    canCheck
                    onCheck={testFunc}
                    data={immutable.Map({ name: 'pe6o', url: 'some url' })}
                    tdStyles={tdStyles}
                    thStyles={thStyles}
                    subscribeUnselect={testFunc}
                    mapColumn={mapColumn}
                />
                <Row
                    linkableColumns={linkableColumns}
                    columns={tableColumns}
                    selected
                    onSelect={testFunc}
                    onCheck={testFunc}
                    data={immutable.Map({ name: 'pe6o', url: 'some url' })}
                    tdStyles={tdStyles}
                    thStyles={thStyles}
                    subscribeUnselect={testFunc}
                    mapColumn={mapColumn}
                />
            </tbody>
        </Table>
    ));

const tdStyles = [{ backgroundColor: '#F5A9BB' }, { backgroundColor: '#DE99A9' }, { backgroundColor: '#BA7F8C' }];
const thStyles = [{ backgroundColor: 'pink' }, { backgroundColor: 'plum' }, { backgroundColor: 'salmon' }, { backgroundColor: 'sandybrown' }, { backgroundColor: 'tomato' }];

const tableColumns = [
    { name: 'Username', key: 'userName' },
    { name: 'First Name', key: 'firstName' },
    { name: 'Last Name', key: 'lastName' },
    { name: 'Roles', key: 'roles' },
    { name: 'Branches', key: 'branches' },
    { name: 'Status', key: 'isEnabled' },
    { name: 'Approved', key: 'isApproved' }
];

const sortableColumns = [true, true, true, true, true, true];
const linkableColumns = [true, false, false, false, false, false];
const testFunc = function(node) { action(node); };
const mapColumn = function(col, colData) {
    if (col.key === 'isApproved') {
        if (colData === true) {
            return 'Yes';
        } else {
            return <span style={{ color: '#cc3333' }}>No</span>;
        }
    }
    if (col.key === 'isEnabled') {
        if (colData === true) {
            return 'Unlocked';
        } else {
            return 'Locked';
        }
    }
    return colData;
};

const allUsers = immutable.fromJS([
    {
        'actorId': '1021',
        'userName': 'bo',
        'firstName': 'Back',
        'lastName': 'Office',
        'roles': 'BO',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/bo/1021' },
    {
        'actorId': '1048',
        'userName': 'ChinaCheckerUser',
        'firstName': 'China User',
        'lastName': 'Checker Admin',
        'roles': 'China_UserChecker',
        'branches': 'China',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/ChinaCheckerUser/1048' },
    {
        'actorId': '1047',
        'userName': 'ChinaMakerUser',
        'firstName': 'China User',
        'lastName': 'Admin',
        'roles': 'China_UserMaker',
        'branches': 'China',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/ChinaMakerUser/1047' },
    {
        'actorId': '1019',
        'userName': 'contentAdmin',
        'firstName': 'User',
        'lastName': 'Admin',
        'roles': 'MC_ContentAdmin',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/contentAdmin/1019' },
    {
        'actorId': '1046',
        'userName': 'CoteDIvoireCheckerUser',
        'firstName': 'CoteDIvoire User',
        'lastName': 'Checker Admin',
        'roles': 'Cote d\'Ivoire UserChecker',
        'branches': 'Cote d\'Ivoire',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/CoteDIvoireCheckerUser/1046' },
    {
        'actorId': '1045',
        'userName': 'CoteDIvoireMakerUser',
        'firstName': 'CoteDIvoire User',
        'lastName': 'Admin',
        'roles': 'Cote d\'Ivoire UserMaker',
        'branches': 'Cote d\'Ivoire',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/CoteDIvoireMakerUser/1045' },
    {
        'actorId': '1020',
        'userName': 'cs',
        'firstName': 'Customer',
        'lastName': 'Service',
        'roles': 'CS',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/cs/1020' },
    {
        'actorId': '1056',
        'userName': 'MadagascarCheckerUser',
        'firstName': 'Madagascar User',
        'lastName': 'Checker Admin',
        'roles': 'Madagascar_UserChecker',
        'branches': 'Madagascar',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/MadagascarCheckerUser/1056' },
    {
        'actorId': '1055',
        'userName': 'MadagascarMakerUser',
        'firstName': 'Madagascar User',
        'lastName': 'Admin',
        'roles': 'Madagascar_UserMaker',
        'branches': 'Madagascar',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/MadagascarMakerUser/1055' },
    {
        'actorId': '1054',
        'userName': 'MaliCheckerUser',
        'firstName': 'Mali User',
        'lastName': 'Checker Admin',
        'roles': 'Mali_UserChecker',
        'branches': 'Mali',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/MaliCheckerUser/1054' },
    {
        'actorId': '1053',
        'userName': 'MaliMakerUser',
        'firstName': 'Mali User',
        'lastName': 'Admin',
        'roles': 'Mali_UserMaker',
        'branches': 'Mali',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/MaliMakerUser/1053' },
    {
        'actorId': '1050',
        'userName': 'NigeriaCheckerUser',
        'firstName': 'Nigeria User',
        'lastName': 'Checker Admin',
        'roles': 'Nigeria_UserChecker',
        'branches': 'Nigeria',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/NigeriaCheckerUser/1050' },
    {
        'actorId': '1049',
        'userName': 'NigeriaMakerUser',
        'firstName': 'Nigeria User',
        'lastName': 'Admin',
        'roles': 'Nigeria_UserMaker',
        'branches': 'Nigeria',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/NigeriaMakerUser/1049' },
    {
        'actorId': '1000',
        'userName': 'sa',
        'firstName': 'Super',
        'lastName': 'Admin',
        'roles': 'N/A',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/sa/1000' },
    {
        'actorId': '1044',
        'userName': 'SenegalCheckerUser',
        'firstName': 'Senegal User',
        'lastName': 'Checker Admin',
        'roles': 'Senegal_UserChecker',
        'branches': 'Senegal',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/SenegalCheckerUser/1044' },
    {
        'actorId': '1043',
        'userName': 'SenegalMakerUser',
        'firstName': 'Senegal User',
        'lastName': 'Admin',
        'roles': 'Senegal_UserMaker',
        'branches': 'Senegal',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/SenegalMakerUser/1043' },
    {
        'actorId': '1052',
        'userName': 'TunisiaCheckerUser',
        'firstName': 'Tunisia User',
        'lastName': 'Checker Admin',
        'roles': 'Tunisia_UserChecker',
        'branches': 'Tunisia',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/TunisiaCheckerUser/1052' },
    {
        'actorId': '1051',
        'userName': 'TunisiaMakerUser',
        'firstName': 'Tunisia User',
        'lastName': 'Admin',
        'roles': 'Tunisia_UserMaker',
        'branches': 'Tunisia',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/TunisiaMakerUser/1051' },
    {
        'actorId': '1017',
        'userName': 'userCheckerAdmin',
        'firstName': 'User Checker',
        'lastName': 'Admin',
        'roles': 'MC_UserCheckerAdmin',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/userCheckerAdmin/1017' },
    {
        'actorId': '1016',
        'userName': 'userMakerAdmin',
        'firstName': 'User Maker',
        'lastName': 'Admin',
        'roles': 'MC_UserMakerAdmin',
        'branches': 'Microcred',
        'isEnabled': true,
        'isApproved': false,
        'url': '/user/users/userMakerAdmin/1016'
    }
]);
