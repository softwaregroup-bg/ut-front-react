import React from 'react';
import { storiesOf } from '@storybook/react';
import Aside from '../../components/PageLayout/Aside';
import Container from '../../components/PageLayout/Container';
import Content from '../../components/PageLayout/Content';
import Table from '../../components/PageLayout/Table';
import headerImg from './../images/PageLayoutHeaderStyled.PNG';
import headerImgHovered from './../images/PageLayoutHeaderStyledHovered.PNG';
// import styles from './../../assets/index.css';

storiesOf('PageLayout', module)
    .add('Aside', () => (
        <Aside
            right
            heading='sample heading'
            styles={{width: '249px'}}
        >
            <div>Aside content</div>
            <div>Aside content</div>
            <div>Aside content</div>
            <div>Aside content</div>
            <div>Aside content</div>
            <div>Aside content</div>
        </Aside>
    ))
    .add('Aside right collapse', () => (
        <Aside
            right={false}
            heading='sample heading'
            styles={{width: '249px'}}
        >
            <div>Aside content</div>
            <div>Aside new line</div>
            <div>Aside another new line</div>
            <div>Aside content</div>
            <div>Aside content</div>
            <div>Aside content</div>
        </Aside>
    ))
    .add('Container resizable', () => (
        <Container>
            <div>Try to resize the browser window to display the windows height and width.</div>
        </Container>
    ))
    .add('Content', () => (
        <Content style={{width: '389px'}}>
            <div>children passed have default styles 'tableCell vaTop h100pr w100pr'</div>
        </Content>
    ))
    .add('Header default', () => (
        <div>
            <div>
                <img style={{width: '100%'}} src={headerImg} />
            </div>
            <p style={{color: 'cornflowerblue'}}>This is only a image because of css colisions. Always use css modules loader for importing css</p>
            <p style={{color: 'cornflowerblue'}}>&lt;Header text='User Management' buttons=&#123;[&#123;text: 'Create User', href: '/user', onClick: function() {}&#125;&#125;]&#125; location=&#123;&#123; pathname: 'CUSTOMER/USER/3' &#125;&#125; breadcrumbsRemoveSlashes=&#123;1&#125; /&gt;&#125;</p>
        </div>
    ))
    .add('Header hovered', () => (
        <div>
            <div>
                <img style={{width: '100%'}} src={headerImgHovered} />
            </div>
            <p style={{color: 'cornflowerblue'}}>This is only a image because of css colisions. Always use css modules loader for importing css. Sample usage:</p>
            <p style={{color: 'cornflowerblue'}}>&lt;Header text='User Management' buttons=&#123;[&#123;text: 'Create User', href: '/user', onClick: function() {}&#125;&#125;]&#125; location=&#123;&#123; pathname: 'CUSTOMER/USER/3' &#125;&#125; breadcrumbsRemoveSlashes=&#123;1&#125; /&gt;</p>
        </div>
    ))
    .add('Table', () => (
        <Table>
            <div>sample content</div>
        </Table>
    ));
