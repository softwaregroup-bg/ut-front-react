import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Button from '../../components/Button';
import { Container, Row, Col } from 'reactstrap';

const buttonTypes = [
    'add',
    'back',
    'cancel',
    'close',
    'close-page',
    'connection',
    'end',
    'import',
    'next',
    // 'reject',
    // 'reject-file',
    'reset',
    'retake',
    'save',
    'send',
    'validate',
    // 'validate-file',
    'custom' // value for custom buttons, example: image as a button
];

storiesOf('Button Component', module)
    .add('default button', () => (
        <Button>My button</Button>
    ))
    .add('All Button Types', () => (
        <Container fluid>
            {buttonTypes.map((item, index) => {
                return <Row key={index} style={{ marginTop: '20px' }}>
                    <Col xs='12'>
                        <Button button={item}>{item}</Button>
                    </Col>
                </Row>;
            })}
        </Container>
    ))
    .add('small buttons', () => (
        <div>
            <Button>Normal button</Button><br />
            <Button sizeType='small'>small button</Button>
        </div>
    ))
    .add('full width buttons', () => (
        <Button fullWidth>My button</Button>
    ));
