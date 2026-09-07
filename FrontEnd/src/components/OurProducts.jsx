import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '../services/api';
import ProductCard from './ProductCard';
import './OurProducts.css';

const OurProducts = ({ searchQuery = '', onAddToCart, onBuyClick }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (searchQuery.trim()) params.search = searchQuery;

                const res = await api.get('/api/products', { params });
                if (res.data.success) {
                    const filtered = res.data.data.filter(p => p.name !== 'Sample Skincare Bottle');
                    setProducts(filtered);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Failed to fetch products from API:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery]);

    const getImageUrl = (product, hover = false) => {
        const BASE = BASE_URL;
        if (product.images && product.images.length > 0) {
            if (hover && product.hoverImage) {
                let img = product.hoverImage;
                img = img.replace(/\\/g, '/');
                if (img.startsWith('http')) return img;
                return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
            }
            let img = hover && product.images[1] ? product.images[1] : product.images[0];
            img = img.replace(/\\/g, '/');
            if (img.startsWith('http')) return img;
            return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
        }
        if (hover && product.hoverImage) {
            let img = product.hoverImage;
            img = img.replace(/\\/g, '/');
            if (img.startsWith('http')) return img;
            return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
        }
        if (!product.image) return '';
        if (product.image.startsWith('http')) return product.image;
        const img = product.image.startsWith('/') ? `${BASE}${product.image}` : `${BASE}/${product.image}`;
        return img;
    };

    if (loading) {
        return (
            <section id="products" className="products-section our-products-section">
                <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <p>Loading products...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="products-section our-products-section">
            <div className="container">
                <div className="our-products-header">
                    <span className="our-products-subtitle">Curated Care</span>
                    <h2 className="our-products-title serif">
                        {searchQuery.trim() === '' ? 'Our Products' : 'Search Results'}
                    </h2>
                    {searchQuery.trim() === '' && (
                        <p className="our-products-desc">
                            Discover our range of dermatologist-tested solutions tailored for your unique skin needs.
                        </p>
                    )}
                </div>

                {products.length > 0 ? (
                    <div className="our-products-grid product-grid">
                        {products.map(product => {
                            const productId = product._id || product.id;
                            const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                            return (
                                <ProductCard
                                    key={productId}
                                    id={productId}
                                    name={product.name}
                                    description={product.description}
                                    category={categoryName}
                                    image={getImageUrl(product)}
                                    hoverImage={getImageUrl(product, true)}
                                    price={product.price}
                                    rating={product.rating}
                                    reviewsCount={product.numReviews}
                                    onAddToCart={onAddToCart}
                                    onBuyClick={onBuyClick}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-results" style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.7 }}>
                        <h3 className="serif">No products found for "{searchQuery}"</h3>
                        <p>Try searching for a different product or category.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurProducts;
