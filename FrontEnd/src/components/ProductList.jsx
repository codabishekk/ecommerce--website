import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../services/api';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ searchQuery = '', onAddToCart, onBuyClick }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {};
                if (searchQuery.trim()) params.search = searchQuery;
                const res = await api.get('/api/products', { params });
                if (res.data.success) {
                    setProducts(res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery]);

    const getImageUrl = (product, hover = false) => {
        const BASE = BASE_URL;
        if (product.images && product.images.length > 0) {
            let imgStr = hover && product.images[1] ? product.images[1] : product.images[0];
            const img = imgStr.replace(/\\/g, '/');
            if (img.startsWith('http')) return img;
            return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
        }
        if (hover && product.hoverImage) {
            if (product.hoverImage.startsWith('http')) return product.hoverImage;
            return product.hoverImage.startsWith('/') ? `${BASE}${product.hoverImage}` : `${BASE}/${product.hoverImage}`;
        }
        if (!product.image) return '';
        if (product.image.startsWith('http')) return product.image;
        const img = product.image.startsWith('/') ? `${BASE}${product.image}` : `${BASE}/${product.image}`;
        return img;
    };

    if (loading) {
        return (
            <section id="products" className="product-section">
                <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <p>Loading products...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="product-section">
            <div className="container">
                <div className="section-header fade-in">
                    <marquee>
                        {products.map(p => p.name.split('–')[0].trim()).join(' || ')}
                    </marquee>
                    <span className="subtitle">Curated Care</span>
                    <h2 className="serif">Our Signature Collection</h2>
                    <p className="section-description">
                        Discover our range of dermatologist-tested solutions tailored for your unique skin needs.
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                description={product.description}
                                category={product.category?.name || product.category}
                                color={product.color}
                                image={getImageUrl(product)}
                                hoverImage={getImageUrl(product, true)}
                                price={product.price}
                                rating={product.rating}
                                reviewsCount={product.numReviews}
                                onAddToCart={onAddToCart}
                                onBuyClick={onBuyClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-results fade-in" style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.6 }}>
                        <h3 className="serif">No products found</h3>
                        <p>We couldn't find any products matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductList;

