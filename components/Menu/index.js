import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar';
import { Container, Row, Col } from 'reactstrap';

Menu.propTypes = {
    children: PropTypes.element,
    menuItems: Sidebar.propTypes.menuItems
};

export default function Menu({ children, menuItems }) {
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs='12'>
                        <Sidebar menuItems={menuItems} />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col xs='2' />
                    <Col xs='10'>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
