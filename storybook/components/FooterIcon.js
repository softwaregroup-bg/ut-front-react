import React from 'react';
import { storiesOf } from '@kadira/storybook';
import FooterIcon from '../../components/FooterIcon';

const iconTypes = [
    'stepPhoneOn', 'stepCropDone'
];
const icon = ['stepScan'];

storiesOf('Footer Icon', module)
    .add('FooterIcon with 2 icons', () => (
        <div>
            <FooterIcon icons={iconTypes} />
        </div>
    ))
    .add('FooterIcon with 1 icon', () => (
        <div>
            <FooterIcon icons={icon} />
        </div>
    ));

// , 'stepSmsOff', 'stepPhoneDone', 'stepSmsOn', 'stepSmsDone'
