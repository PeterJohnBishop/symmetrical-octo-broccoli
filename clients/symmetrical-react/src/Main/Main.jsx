import React from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';

import MainGrid from '../Main/MainGrid';
import MainCarousel from '../Main/MainCarousel';
import Register from '../Auth/Register';
import Login from '../Auth/Login';

const Main = () => {
    const [newUser, setNewUser] = React.useState(false);

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center App-header">
            <Row className="text-center">
                <Col>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <MainGrid />
                    <Button
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="link"
                    >
                        Learn React
                    </Button>
                    <MainCarousel />
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label={newUser ? "New User" : "Existing User"}
                        checked={newUser}
                        onChange={() => setNewUser(!newUser)}
                        className="d-flex justify-content-center align-items-center gap-2"
                        style={{ fontSize: '1.2rem', margin: '1rem' }}
                    />
                    {newUser ? <Register /> : <Login />}
                    
                </Col>
            </Row>
        </Container>
    );
};

export default Main;