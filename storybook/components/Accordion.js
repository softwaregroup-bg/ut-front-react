import React from 'react';
import { storiesOf } from '@storybook/react';
import Accordion from './../../components/Accordion';

storiesOf('Accordion', module)
    .add('Initial extended', () => (
        <div>
            <Accordion
                title='IDENTIFICATION'
            >
                <div>child</div>
            </Accordion>
            <p style={{ color: 'cornflowerblue' }}>additional props will be passed to Box component</p>
        </div>
    ))
    .add('Collapsed', () => (
        <Accordion
            title='IDENTIFICATION'
            collapsed
        >
            <div>child</div>
        </Accordion>
    ));
