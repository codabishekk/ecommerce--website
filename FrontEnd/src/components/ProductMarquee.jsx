// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api, { BASE_URL } from '../services/api';
// import './ProductMarquee.css';

// const ProductMarquee = () => {
//     const [products, setProducts] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchAllProducts = async () => {
//             try {
//                 const res = await api.get('/api/products');
//                 if (res.data.success) {
//                     const filtered = res.data.data.filter(p => p.name !== 'Sample Skincare Bottle');
//                     setProducts(filtered);
//                 } else {
//                     setProducts([]);
//                 }
//             } catch (err) {
//                 console.error('API Error in Marquee:', err);
//                 setProducts([]);
//             }
//         };
//         fetchAllProducts();
//     }, []);

//     const getImageUrl = (product) => {
//         const BASE = BASE_URL;
//         if (product.images && product.images.length > 0) {
//             let img = product.images[0].replace(/\\/g, '/');
//             if (img.startsWith('http')) return img;
//             return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
//         }
//         if (!product.image) return '';
//         if (product.image.startsWith('http')) return product.image;
//         return product.image.startsWith('/') ? `${BASE}${product.image}` : `${BASE}/${product.image}`;
//     };

//     if (products.length === 0) return null;

//     // Triple the products array to ensure a seamless infinite scroll even on large screens
//     const displayProducts = [...products, ...products, ...products];

//     return (
//         <div className="product-marquee-section">
//             <div className="container">
//                 <h2 className="marquee-title serif">You Might Also Like</h2>
//             </div>
//             <div className="marquee-wrapper">
//                 <div className="marquee-content">
//                     {displayProducts.map((product, index) => (
//                         <div
//                             key={index}
//                             className="marquee-product-card"
//                             onClick={() => navigate(`/product/${product._id || product.id}`)}
//                         >
//                             <div className="marquee-image-box glass">
//                                 <img src={getImageUrl(product)} alt={product.name} />
//                             </div>
//                             <div className="marquee-info">
//                                 <span className="cat">{typeof product.category === 'object' ? product.category.name : product.category}</span>
//                                 <h3>{product.name.split('–')[0]}</h3>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductMarquee;
