import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import firebase from './firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email address';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const storeToken = async (user) => {
        try {
            const token = await user.getIdToken();
            localStorage.setItem('firebaseToken', token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const handleError = (errorCode, errorMessage) => {
        alert(`Error: ${errorCode}\nMessage: ${errorMessage}`);
        setEmail('');
        setPassword('');
        setErrors({});
        localStorage.clear();
    };

    const login = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                setUser(userCredential.user);
                storeToken(userCredential.user);
                setSuccess(true);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                setSuccess(false);
                handleError(errorCode, errorMessage);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            login();
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="light" type="submit" style={{ margin: '1rem' }}>
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;