import React from 'react';
import { storiesOf } from '@storybook/react';
import { Container, Row, Col } from 'reactstrap';
import Box from '../../components/Box';

storiesOf('Box Component', module)
    .add('Normal box', () => (
        <Box>Component</Box>
    )).add('Advanced box with form', () => (
        <Container>
            <Row>
                <Col md={{ size: 4, offset: 4 }}>
                    <Box style={{padding: '10px'}} className='test-box-class'>
                        <Row>
                            <Col md={{ size: 8, offset: 2 }}><input /></Col>
                            <Col md={{ size: 8, offset: 2 }}><input /></Col>
                            <Col md={{ size: 8, offset: 2 }}><button>submit</button></Col>
                        </Row>
                    </Box>
                </Col>
            </Row>
        </Container>
    )).add('Box with title', () => (
        <Box title='Box title'>Component</Box>
    )).add('Box with title and close', () => (
        <Box title='Box title' showClose>Component</Box>
    )).add('Box with small title', () => (
        <Box title='Box title' showClose titleType='small'>Component</Box>
    ));
