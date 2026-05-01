import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProductForm from './pages/Admin/AdminProductForm';
import { AboutPage, PrivacyPage, TermsPage, ReturnsPage, FAQPage } from './pages/InfoPages/InfoPages';
import CookieConsent from './components/CookieConsent/CookieConsent';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import './index.css';

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: '#c9a96e', secondary: '#000' } },
            }}
          />
          <ScrollToTop />
          <CookieConsent />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/edit/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/rreth-nesh" element={<AboutPage />} />
                  <Route path="/politika-privatesise" element={<PrivacyPage />} />
                  <Route path="/kushtet-perdorimit" element={<TermsPage />} />
                  <Route path="/kthim-rimbursim" element={<ReturnsPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
