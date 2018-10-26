import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Image from '../../components/Image';

storiesOf('Image', module)
    .add('Default', () => (
        <Image
            src='http://media.glamour.com/photos/57334401c8ad30c15b6b97b8/master/pass/body-image.jpg'
            className='test-class'
            id='test-id'
        />
    ));
