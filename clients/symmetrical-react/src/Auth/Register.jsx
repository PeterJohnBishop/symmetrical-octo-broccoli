import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import firebase from './firebase';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must include at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must include at least one lowercase letter';
        }
        if (!hasNumber) {
            return 'Password must include at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must include at least one special character';
        }
        return null;
    };

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
        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;
        if (password !== passwordVerify) newErrors.passwordVerify = 'Passwords do not match';
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
        setPasswordVerify('');
        setErrors({});
        localStorage.clear();
    };

    const register = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
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
            register();
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

                        <Form.Group controlId="formPasswordVerify">
                            <Form.Label>Verify Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Verify Password"
                                value={passwordVerify}
                                onChange={(e) => setPasswordVerify(e.target.value)}
                                isInvalid={!!errors.passwordVerify}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.passwordVerify}
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

export default Register;