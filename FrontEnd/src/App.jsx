import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import TopBar from './components/TopBar';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import ProductList from './components/ProductList';
import SkinTypes from './components/SkinTypes';
import HealthySkin from './components/HealthySkin';
import ProtectionSection from './components/ProtectionSection';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import PaymentProcess from './pages/PaymentProcess';
import OurProducts from './components/OurProducts';
import BrandSection from './components/BrandSection';
import WhatsAppButton from './components/WhatsAppButton';
import AuthModal from './components/AuthModal';
import Profile from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import './App.css';


// Admin Components
import AdminLayout from './components/admin/Layout/AdminLayout';
import AdminLogin from './pages/admin/Login';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import OrdersPage from './pages/admin/OrdersPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProductsPage from './pages/admin/ProductsPage';
import BannersPage from './pages/admin/BannersPage';
import RolesPage from './pages/admin/RolesPage';

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authProduct, setAuthProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const resolveCartImage = (product) => {
    if (!product) return '';
    if (product.image) return product.image;
    if (product.images && Array.isArray(product.images) && product.images.length) return product.images[0];
    return '';
  };

  const buildCartItem = (product, quantity = 1) => {
    const productId = product._id || product.id;
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
    const imageUrl = resolveCartImage(product);
    return {
      ...product,
      id: productId,
      category: categoryName,
      image: imageUrl,
      quantity,
    };
  };

  const handleBuyClick = (product) => {
    if (user) {
      const item = buildCartItem(product, 1);
      setCart([item]);
      navigate('/cart');
    } else {
      setAuthProduct(product);
      setIsAuthOpen(true);
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    const productId = product._id || product.id;
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
    const imageUrl = resolveCartImage(product);

    setCart(prevCart => {
      const existingItem = prevCart.find(item => (item._id || item.id) === productId);
      if (existingItem) {
        return prevCart.map(item =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, id: productId, category: categoryName, image: imageUrl, quantity }];
    });
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => (item._id || item.id) !== productId));
  };

  return (
    <>
      {isSplashVisible && <SplashScreen onComplete={() => setIsSplashVisible(false)} />}
      <ScrollToTop />
      <div className={isAdminRoute ? 'admin-app-container' : 'app'}>
        {!isAdminRoute && <TopBar />}
        {!isAdminRoute && (
          <Header
            cartCount={cart.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAuthClick={() => setIsAuthOpen(true)}
          />
        )}
        <main>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={
              <>
                <div id="home">
                  <HeroCarousel />
                </div>
                <BrandSection />
                <OurProducts searchQuery={searchQuery} />
                <div id="skin-types">
                  <SkinTypes />
                </div>
                <div id="about">
                  <HealthySkin />
                </div>
                <div id="protection">
                  <ProtectionSection />
                </div>
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={
              <Cart
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
              />
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<PaymentProcess cart={cart} />} />
            <Route path="/product/:name/:id" element={<ProductDetail onAddToCart={handleAddToCart} onBuyClick={handleBuyClick} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} onBuyClick={handleBuyClick} />} />

            {/* Admin Routes */}
            {/* Note: We handle login outside of AdminLayout so it doesn't show sidebar */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />

                <Route path="products" element={<ProductsPage />} />
                <Route path="banners" element={<BannersPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

          </Routes>
        </main>
        
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppButton />}
        {!isAdminRoute && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            product={authProduct}
          />
        )}
      </div>
    </>
  );
}

export default App;

