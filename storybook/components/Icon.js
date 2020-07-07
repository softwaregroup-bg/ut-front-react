import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from '../../components/Icon';
import classnames from 'classnames';
import style from '../styles.css';

const iconNames = [
    'accountArrowDown',
    'accountArrowUp',
    'add',
    'addActive',
    'arrowDown',
    'arrowLeft',
    'arrowUp',
    'arrowUpPink',
    'arrowRightPink',
    'arrowDownPink',
    'arrowLeftPink',
    'close',
    'closeToolTip',
    'edit',
    'error',
    'done',
    'importCamera',
    'importFolder',
    'importScanner',
    'infoToolTip',
    'lock',
    'logout',
    'padlock',
    'reject',
    'status',
    'stepCropOff',
    'stepCropOn',
    'stepCropDone',
    'stepFingerLeftOff',
    'stepFingerLeftOn',
    'stepFingerLeftDone',
    'stepFingerRightOff',
    'stepFingerRightOn',
    'stepFingerRightDone',
    'stepImportOff',
    'stepImportOn',
    'stepImportDone',
    'stepPhoneOff',
    'stepPhoneOn',
    'stepPhoneDone',
    'stepScan',
    'stepShutter',
    'stepSmsOff',
    'stepSmsOn',
    'stepSmsDone',
    'validate',
    'custom'
];

storiesOf('Icon Component', module)
    .add('All Icons', () => (
        <div className='clearfix' style={{background: '#EAF0F7'}}>
            <input type='checkbox' className={classnames(style.toggle_icons, 'margin-all-10')} id='toggler' /><label htmlFor='toggler'>Toggle icons outline</label>
            <hr />
            <div className={style.allIcons}>
                {iconNames.map((item, index) => {
                    return <div key={index} style={{display: 'inline-block', float: 'left', border: '1px solid #000', margin: '5px', padding: '10px', width: '180px', height: '180px'}}>
                        <div style={{textAlign: 'center', margin: '20px', minHeight: '50px'}}>
                            <Icon icon={item} />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>Usage:</div>
                            <div style={{fontWeight: 'bold'}}>icon: "{item}"</div>
                        </div>
                    </div>;
                })}
            </div>
        </div>
    ))
    .add('Icon hover example', () => (
        <Icon icon='close' hover />
    ));
