import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainGrid = () => {

    const style = {
        card: {
            // "width": "500px",
            // "height": "300px",
            "margin": "10px",
            "backgroundColor": "white",
            "borderRadius": "10px",
            "boxShadow": "0 6px 12px rgba(0, 0, 0, 0.1)"
        }
    }

    const cardData = [
        { title: 'Card 1', text: 'This is card number 1.' },
        { title: 'Card 2', text: 'This is card number 2.' },
        { title: 'Card 3', text: 'This is card number 3.' },
        { title: 'Card 4', text: 'This is card number 4.' },
        { title: 'Card 5', text: 'This is card number 5.' },
        { title: 'Card 6', text: 'This is card number 6.' },
    ];

    const cards = cardData.map((item, index) => (
        <Col key={index} xs={12} md={4} lg={2} className="d-flex justify-content-center mb-4">
            <Card style={style.card}>
                <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>
                        {item.text}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    ));

    return (
        <Container className="d-flex justify-content-center">
            <Row>
                {cards}
            </Row>
        </Container>
    );
};

export default MainGrid;

