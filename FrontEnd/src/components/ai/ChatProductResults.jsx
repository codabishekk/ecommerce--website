import React from 'react';
import ProductCard from '../ProductCard';
import { BASE_URL } from '../../services/api';

const normalizeImage = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
};

const ChatProductResults = ({ products, onAddToCart, onBuyClick }) => {
    if (!products || products.length === 0) return null;
    return (
        <div className="ai-products">
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    category={p.category}
                    color={p.color}
                    image={normalizeImage(p.image)}
                    price={p.price}
                    rating={p.rating}
                    reviewsCount={p.reviewsCount}
                    onAddToCart={onAddToCart}
                    onBuyClick={onBuyClick}
                />
            ))}
        </div>
    );
};

export default ChatProductResults;
