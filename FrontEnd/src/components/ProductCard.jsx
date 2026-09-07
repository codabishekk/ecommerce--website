import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import './ProductCard.css';

const ProductCard = ({
    id,
    name,
    description,
    category,
    color,
    image,
    hoverImage,
    price,
    rating,
    reviewsCount,
    onAddToCart,
    onBuyClick
}) => {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    /* Scroll animation */
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('show');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    /* Add to cart */
    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        onAddToCart?.({
            id,
            name,
            price,
            rating,
            reviewsCount,
            category,
            color,
            description,
            image
        });
    };

    /* Buy */
    const handleBuyClick = (e) => {
        e.stopPropagation();
        onBuyClick?.({
            id,
            name,
            price,
            rating,
            reviewsCount,
            category,
            color,
            description,
            image
        });
    };

    return (
        <div className="product-card" ref={cardRef}>

            {/* IMAGE SECTION */}
            <div className="product-image-container">

                {/* Main Image */}
                <img
                    src={image}
                    alt={name}
                    className={`product-image ${hoverImage ? 'main-img' : ''}`}
                />

                {/* Hover Image (only if exists) */}
                {hoverImage && (
                    <img
                        src={hoverImage}
                        alt={name}
                        className="product-image hover-img"
                    />
                )}

                {/* Badge */}
                <div className="product-badge">{category}</div>
            </div>

            {/* INFO */}
            <div
                className="product-info"
                onClick={() => navigate(`/product/${slugify(name)}/${id}`)}
            >
                <div className="product-meta">
                    <div className="product-price">MRP: ₹{price}</div>

                    <div className="product-rating">
                        <span className="star" aria-hidden="true">★</span> {rating}
                        <span className="reviews-count">
                            ({reviewsCount} reviews)
                        </span>
                    </div>
                </div>

                <h3 className="product-title">{name}</h3>

                <p className="product-description">{description}</p>

                <div className="product-footer">
                    <button className="btn-primary product-btn" onClick={handleBuyClick}>
                        <span className="btn-icon" aria-hidden="true"></span> BUY
                    </button>

                    <button className="btn-secondary product-btn" onClick={handleAddToCartClick}>
                        <span className="btn-icon" aria-hidden="true">🛒</span> CART
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;