import React from 'react';
import { storiesOf } from '@storybook/react';
import Grid from '@material-ui/core/Grid';
import Box from '../../components/Box';

storiesOf('Box Component', module)
    .add('Normal box', () => (
        <Box>Component</Box>
    )).add('Advanced box with form', () => (
        <Grid container justify='center'>
            <Grid item md={4}>
                <Box style={{padding: '10px'}} className='test-box-class'>
                    <Grid container item justify='center' md={8}><input /></Grid>
                    <Grid container item justify='center' md={8}><input /></Grid>
                    <Grid container item justify='center' md={8}><button>submit</button></Grid>
                </Box>
            </Grid>
        </Grid>
    )).add('Box with title', () => (
        <Box title='Box title'>Component</Box>
    )).add('Box with title and close', () => (
        <Box title='Box title' showClose>Component</Box>
    )).add('Box with small title', () => (
        <Box title='Box title' showClose titleType='small'>Component</Box>
    ));
