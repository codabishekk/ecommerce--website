import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../services/api';
import { slugify } from '../utils/slugify';
import './OurProducts.css';

const OurProducts = ({ searchQuery = '' }) => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
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

    useEffect(() => {
        const cards = sectionRef.current?.querySelectorAll('.our-product-card');
        if (!cards) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
            observer.observe(card);
        });

        return () => observer.disconnect();
    }, [products]);

    const getImageUrl = (product, hover = false) => {
        const BASE = BASE_URL;
        // API product: uses images[]
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
        // Static product: uses image / hoverImage
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
        <section id="products" className="products-section our-products-section" ref={sectionRef}>
            <div className="container">
                <h2 className="our-products-title serif">
                    {searchQuery.trim() === '' ? 'Our Product' : 'Search Results'}
                </h2>

                {products.length > 0 ? (
                    <div className="our-products-grid product-grid">
                        {products.map(product => {
                            const productId = product._id || product.id;
                            return (
                                <div
                                    key={productId}
                                    className="our-product-card"
                                    onClick={() => navigate(`/product/${slugify(product.name)}/${productId}`)}
                                    onMouseEnter={e => {
                                        const img = e.currentTarget.querySelector('.our-product-image');
                                        if (img) img.src = getImageUrl(product, true);
                                    }}
                                    onMouseLeave={e => {
                                        const img = e.currentTarget.querySelector('.our-product-image');
                                        if (img) img.src = getImageUrl(product, false);
                                    }}
                                >
                                    <div className="our-product-image-container">
                                        <img src={getImageUrl(product)} alt={product.name} className="our-product-image" />
                                    </div>
                                    <h3 className="our-product-name">{product.name.split('–')[0]}</h3>
                                </div>
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

