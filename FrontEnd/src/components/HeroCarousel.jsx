import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import api, { BASE_URL } from '../services/api';

// Import slick-carousel css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './HeroCarousel.css';

const HeroCarousel = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (img) => {
        if (!img) return '';
        img = img.replace(/\\/g, '/');
        if (img.startsWith('http')) return img;
        const BASE = BASE_URL;
        return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
    };

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/banners');
            if (res.data.success && res.data.data.length > 0) {
                setOffers(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch banners', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const scrollToProducts = (e) => {
        if (e) e.stopPropagation();
        const element = document.getElementById('products');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        fade: true,
        pauseOnHover: true,
        cssEase: "linear",
        afterChange: (current) => {
            requestAnimationFrame(() => {
                document.querySelectorAll('.hero-slider .slick-slide').forEach((slide, i) => {
                    if (i === current) {
                        slide.removeAttribute('inert');
                    } else {
                        slide.setAttribute('inert', '');
                    }
                });
            });
        }
    };

    if (loading || offers.length === 0) {
        return null;
    }

    return (
        <section className="hero-carousel-wrapper">
            <Slider {...settings} className="hero-slider">
                {offers.map((slide, index) => (
                    <div
                        className="slide-container"
                        key={slide._id || index}
                        onClick={() => slide.link ? navigate(slide.link) : scrollToProducts()}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="hero-slide-item">
                            {/* Background Layer */}
                            <div
                                className="slide-background"
                                style={{
                                    backgroundImage: `url(${getImageUrl(slide.image)})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="overlay" />
                            </div>

                            {/* Content Layer */}
                            <div className="container carousel-content full-banner-content">
                                <div className="carousel-text fade-in">
                                    {slide.title && <h1 className="serif">{slide.title}</h1>}
                                    {slide.description && <p className="offer-desc">{slide.description}</p>}
                                    {/*<div className="hero-cta">
                                        <button className="btn-primary hero-cta-btn" onClick={(e) => { e.stopPropagation(); scrollToProducts(); }}>
                                            Shop Collection
                                        </button>
                                    </div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default HeroCarousel;
