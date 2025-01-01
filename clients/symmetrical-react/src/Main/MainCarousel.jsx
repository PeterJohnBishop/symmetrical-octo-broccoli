import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const exampleData = [
    { id: 1, title: 'Card 1', description: 'This is card 1', moreInfo: 'More info about card 1' },
    { id: 2, title: 'Card 2', description: 'This is card 2', moreInfo: 'More info about card 2' },
    { id: 3, title: 'Card 3', description: 'This is card 3', moreInfo: 'More info about card 3' },
    { id: 4, title: 'Card 4', description: 'This is card 4', moreInfo: 'More info about card 4' },
    { id: 5, title: 'Card 5', description: 'This is card 5', moreInfo: 'More info about card 5' },
    { id: 6, title: 'Card 6', description: 'This is card 6', moreInfo: 'More info about card 6' },
];

const MainCarousel = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (id) => {
        setSelectedCard(selectedCard === id ? null : id);
    };

    const style = {
        carouselContainer: {
            "width": "100vw",
            "padding": "20px",
            "boxSizing": "border-box"
        },
        card: {
            "width": "50vw",
            "padding": "20px",
            "margin": "auto",
            "backgroundColor": "white",
            "borderRadius": "10px",
            "boxShadow": "0 4px 8px rgba(0, 0, 0, 0.1)"
        },
        selected: {
            border: "2px solid #007bff"
        }
    }

    return (
        <div className="carousel-container" style={style.carouselContainer}>
            <Carousel indicators={false}>
                {exampleData.map((item) => (
                    <Carousel.Item key={item.id}>
                        <div
                            className={`card ${selectedCard === item.id ? 'selected' : ''}`}
                            onClick={() => handleCardClick(item.id)}
                            style={{ ...style.card, ...(selectedCard === item.id ? style.selected : {}) }}
                        >
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            {selectedCard === item.id && <p>{item.moreInfo}</p>}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default MainCarousel;
