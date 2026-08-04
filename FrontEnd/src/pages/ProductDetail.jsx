import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../services/api';
import ProductAccordion from '../components/ProductAccordion';
import ProductReviews from '../components/ProductReviews';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slugify } from '../utils/slugify';
import './ProductDetail.css';
import styles from './ProductDetail.module.css';


const ProductDetail = ({ onAddToCart, onBuyClick }) => {
    const { name, id } = useParams();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Dynamic rating state
    const [dynamicRating, setDynamicRating] = useState(0);
    const [dynamicReviewsCount, setDynamicReviewsCount] = useState(0);
    const [currentImage, setCurrentImage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [mobileScrollIndex, setMobileScrollIndex] = useState(0);

    const [showStickyBuy, setShowStickyBuy] = useState(false);
    const [showDesktopSticky, setShowDesktopSticky] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const purchaseRef = React.useRef(null);
    const detailInfoRef = React.useRef(null);
    const headerTriggerRef = React.useRef(null); // Reference to trigger desktop sticky bar
    const swipeTrackRef = React.useRef(null);
    const thumbColumnRef = React.useRef(null);
    const relatedCarouselRef = React.useRef(null);

    // 🔥 Amazon-style scroll logic with IntersectionObserver
    useEffect(() => {
        if (!purchaseRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show mobile sticky buy if buttons scroll out
                if (window.innerWidth <= 768) {
                    setShowStickyBuy(!entry.isIntersecting && entry.boundingClientRect.top < 0);
                    setShowDesktopSticky(false);
                } else {
                    // Show desktop sticky buy if buttons scroll out
                    setShowDesktopSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
                    setShowStickyBuy(false);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(purchaseRef.current);
        return () => observer.disconnect();
    }, [product]);

    // 🔥 Scroll progress tracker for smooth animations and progress bar
    useEffect(() => {
        const handleScroll = () => {
            if (!detailInfoRef.current) return;

            const element = detailInfoRef.current;
            const elementTop = element.getBoundingClientRect().top;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress (0 to 1)
            const progress = Math.max(0, Math.min(1, 1 - (elementTop / windowHeight)));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getImageUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http')) return img;
        const BASE = BASE_URL;
        return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/products/${id}`);
                if (res.data && res.data.success) {
                    const apiProd = res.data.data;
                    const baseImages = Array.isArray(apiProd.images) && apiProd.images.length ? apiProd.images : (apiProd.image ? [apiProd.image] : []);
                    const normalized = baseImages.map(getImageUrl).filter(Boolean);
                    setProduct(apiProd);
                    setCurrentImage(normalized[0] || '');
                    setCurrentImageIndex(0);
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error('Failed to fetch product', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await api.get('/api/products');
                if (res.data && res.data.success) {
                    setAllProducts(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch all products', err);
            }
        };
        fetchAllProducts();
    }, []);

    // ✅ Load reviews from localStorage whenever product is set
    useEffect(() => {
        if (id && product) {
            const storageKey = `sholash_reviews_${id}`;
            const savedReviews = localStorage.getItem(storageKey);

            if (savedReviews) {
                const reviews = JSON.parse(savedReviews);

                if (reviews.length > 0) {
                    const total = reviews.length;
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

                    setDynamicRating(avg.toFixed(1));
                    setDynamicReviewsCount(total);
                } else {
                    setDynamicRating(product.rating || 0);
                    setDynamicReviewsCount(0);
                }
            } else {
                setDynamicRating(product.rating || 0);
                setDynamicReviewsCount(product.reviewsCount || product.numReviews || 0);
            }
        }
    }, [id, product]);

    // 🔥 Amazon-style carousel scroll detection & arrow visibility
    useEffect(() => {
        const updateScrollArrows = () => {
            if (!relatedCarouselRef.current) return;
            const carousel = relatedCarouselRef.current;
            const scrollLeft = carousel.scrollLeft;
            const scrollWidth = carousel.scrollWidth;
            const clientWidth = carousel.clientWidth;

            // Show left arrow if scrolled right
            setCanScrollLeft(scrollLeft > 0);
            // Show right arrow if not at the end
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        };

        const carousel = relatedCarouselRef.current;
        if (carousel) {
            updateScrollArrows();
            carousel.addEventListener('scroll', updateScrollArrows);
            window.addEventListener('resize', updateScrollArrows);

            return () => {
                carousel.removeEventListener('scroll', updateScrollArrows);
                window.removeEventListener('resize', updateScrollArrows);
            };
        }
    }, [allProducts]);

    // Define galleryImages before the useEffect that uses it
    const categoryName = typeof product?.category === 'object'
        ? product.category?.name
        : product?.category;

    const galleryImages = product
        ? (Array.isArray(product.images) && product.images.length ? product.images : [product.image]).map(getImageUrl).filter(Boolean)
        : [];

    const selectedImage = galleryImages[currentImageIndex] || galleryImages[0] || currentImage;

    // 🔥 Enhanced scroll interaction for image changes
    useEffect(() => {
        if (!detailInfoRef.current || !galleryImages || galleryImages.length <= 1) return;

        const handleScrollImageChange = () => {
            const detailInfo = detailInfoRef.current;
            const rect = detailInfo.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Calculate which section of the content we're in
            const totalHeight = detailInfo.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, (scrollTop - rect.top + viewportHeight) / (totalHeight + viewportHeight)));

            // Change image based on scroll progress (divide content into segments)
            const imageIndex = Math.min(galleryImages.length - 1, Math.floor(scrollProgress * galleryImages.length));

            if (imageIndex !== currentImageIndex && imageIndex >= 0) {
                setCurrentImageIndex(imageIndex);
                setCurrentImage(galleryImages[imageIndex]);
            }
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScrollImageChange();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [galleryImages, currentImageIndex]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2>Product Not Found</h2>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '20px' }}>
                    Back to Collection
                </button>
            </div>
        );
    }

    const handleThumbnailClick = (index) => {
        if (!galleryImages.length) return;
        const nextImage = galleryImages[index] || galleryImages[0];
        
        // Add fade effect
        const imageElement = document.querySelector('.detail-hero-image');
        if (imageElement) {
            imageElement.classList.add('fade-out');
            setTimeout(() => {
                setCurrentImageIndex(index);
                setCurrentImage(nextImage);
                imageElement.classList.remove('fade-out');
                imageElement.classList.add('fade-in');
            }, 150);
        } else {
            setCurrentImageIndex(index);
            setCurrentImage(nextImage);
        }
    };

    const showPrevImage = () => {
        if (!galleryImages.length) return;
        const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        setCurrentImageIndex(prevIndex);
        setCurrentImage(galleryImages[prevIndex]);
    };

    const showNextImage = () => {
        if (!galleryImages.length) return;
        const nextIndex = (currentImageIndex + 1) % galleryImages.length;
        setCurrentImageIndex(nextIndex);
        setCurrentImage(galleryImages[nextIndex]);
    };

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
    };

    const handleMobileScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.clientWidth;
        if (width > 0) {
            const index = Math.round(scrollLeft / width);
            setMobileScrollIndex(index);
        }
    };

    // 🔥 Amazon-style carousel scroll handlers
    const scrollCarousel = (direction) => {
        if (!relatedCarouselRef.current) return;
        const carousel = relatedCarouselRef.current;
        const scrollAmount = 300; // Scroll by 300px per click
        
        carousel.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className={styles.productDetailPage}>
            {/* Scroll Progress Indicator */}
            <div 
                className={styles.scrollProgress} 
                style={{ transform: `scaleX(${scrollProgress})` }}
            ></div>
            
            <div className="container">

                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span> /
                    <span onClick={() => navigate('/')}> {categoryName}</span> /
                    <span className="active"> {product.name}</span>
                </div>

                <div className={`${styles.detailContainer} detail-container`}>

                    {/* Image */}
                    <div className={`${styles.leftColumn} detail-visual`}>
                        <div className="detail-gallery fade-in">
                            <div className="thumbnail-column" ref={thumbColumnRef}>
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={`${product.id}-thumb-${idx}`}
                                        className={`thumbnail-btn ${currentImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => handleThumbnailClick(idx)}
                                    >
                                        <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>

                            <div className="detail-image-wrapper glass">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="detail-hero-image zoom-hover fade-in"
                                />

                                {galleryImages.length > 1 && (
                                    <>
                                        <button className="nav-arrow left" onClick={showPrevImage}>
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button className="nav-arrow right" onClick={showNextImage}>
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Swipe Gallery */}
                        <div className="mobile-swipe-gallery">
                            <div 
                                className="swipe-track" 
                                ref={swipeTrackRef}
                                onScroll={handleMobileScroll}
                            >
                                {galleryImages.map((img, idx) => (
                                    <div className="swipe-slide" key={idx}>
                                        <img src={img} alt={`${product.name} ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                            {galleryImages.length > 1 && (
                                <>
                                    <div className="swipe-dots">
                                        {galleryImages.map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`swipe-dot ${mobileScrollIndex === idx ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (swipeTrackRef.current) {
                                                        swipeTrackRef.current.scrollTo({
                                                            left: idx * swipeTrackRef.current.clientWidth,
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="mobile-image-counter">
                                        {mobileScrollIndex + 1} / {galleryImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className={`${styles.rightColumn} detail-info`} ref={detailInfoRef}>
                        <div className="fade-in">
                            <span className="detail-category">{categoryName}</span>
                        <h1 className="product-title">{product.name}</h1>
                        <h2 className='tag'>{product.tagline}</h2>

                        <div className="promo-text">
                            <h3>{product.promoTitle}</h3>
                            <p>{product.promoContent}</p>
                        </div>

                        <div className="detail-meta">
                            <div className="detail-price">MRP: ₹{product.price}</div>

                            <div className="detail-rating">
                                <span className="star">★</span>
                                <span className="rating-val">{dynamicRating}</span>
                                <span className="rev-count">({dynamicReviewsCount} reviews)</span>
                            </div>
                        </div>

                        <p className="detail-desc">{product.description}</p>

                        {product.beforeText && (
                            <div className="before-text" style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                {product.beforeText}
                            </div>
                        )}

                        {product.target && product.target.length > 0 && (
                            <div className="target-audience-section">
                                <span className="target-label">Suitability & Care Guide</span>
                                <div className="target-badges-container">
                                    {product.target.map((item, idx) => (
                                        <span key={idx} className="target-badge">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="detail-features">
                            <h3>Key Benefits:</h3>
                            <ul>
                                {product.features?.map((feature, index) => (
                                    <li key={index}>
                                        <span className="check">✓</span> {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {product.afterText && (
                            <div className="after-text" style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                {product.afterText}
                            </div>
                        )}

                        {/* Quantity + Buttons */}
                        <div className="purchase-controls" ref={purchaseRef}>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>

                            <button className=" btn-add-large large btn-add-cart" onClick={handleAddToCart}>
                                Add to Cart
                            </button>

                            <button className="btn-add-large btn-buy" onClick={() => onBuyClick && onBuyClick(product)}>
                                BUY
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra Sections */}
            <ProductAccordion product={product} />

            {/* Related Products Carousel (Amazon Style) */}
            <div className="related-products-section">
                <div className="container">
                    <h2 className="related-title serif">Customers also viewed</h2>
                    <div className="carousel-wrapper">
                        {/* Left Arrow */}
                        <button 
                            className={`carousel-arrow carousel-arrow-left ${canScrollLeft ? 'visible' : ''}`}
                            onClick={() => scrollCarousel('left')}
                            aria-label="Scroll left"
                        >
                            ◀
                        </button>

                        {/* Carousel */}
                        <div className="related-carousel" ref={relatedCarouselRef}>
                            {allProducts.filter(p => (p._id || p.id) !== id).slice(0, 6).map(item => (
                                <div 
                                    key={item._id || item.id} 
                                    className="related-card"
                                    onClick={() => {
                                        const productId = item._id || item.id;
                                        navigate(`/product/${slugify(item.name)}/${productId}`);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    <img src={getImageUrl(item.image || (item.images && item.images[0]))} alt={item.name} />
                                    <h3>{item.name.split('–')[0]}</h3>
                                    <p>₹{item.price}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button 
                            className={`carousel-arrow carousel-arrow-right ${canScrollRight ? 'visible' : ''}`}
                            onClick={() => scrollCarousel('right')}
                            aria-label="Scroll right"
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </div>

            <ProductReviews />

            {/* Desktop Sticky Header (Amazon style) */}
            <div className={`desktop-sticky-header ${showDesktopSticky ? 'visible' : ''}`}>
                <div className="container sticky-flex">
                    <div className="sticky-left">
                        <img src={selectedImage} alt={product.name} />
                        <div className="sticky-name-group">
                            <span className="sticky-n">{product.name}</span>
                            <span className="sticky-r">★ {dynamicRating}</span>
                        </div>
                    </div>
                    <div className="sticky-right">
                        <span className="sticky-p">₹{product.price}</span>
                        <button className="sticky-btn-cart" onClick={handleAddToCart}>Add to Cart</button>
                        <button className="sticky-btn-buy" onClick={() => onBuyClick && onBuyClick(product)}>Buy Now</button>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Buy Bar */}
            <div className={`mobile-sticky-buy ${showStickyBuy ? 'visible' : ''}`} style={{
                opacity: Math.min(1, scrollProgress * 1.5),
                backdropFilter: `blur(${Math.min(10, scrollProgress * 20)}px)`
            }}>
                <div className="sticky-price-info">
                    <span className="sc-name">{product.name}</span>
                    <span className="sc-rating">
                        <span className="star" style={{ fontSize: '0.9rem' }}>★</span>
                        <span>{dynamicRating}</span>
                    </span>
                    <span className="sc-price">₹{product.price}</span>
                </div>
                <div className="sticky-actions">
                    <button className="btn-sticky-cart" onClick={handleAddToCart} title="Add to Cart">
                        🛒
                    </button>
                    <button className="btn-sticky-buy" onClick={() => onBuyClick && onBuyClick(product)}>
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
