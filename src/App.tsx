import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Index from './pages/Index';
import Auth from './pages/Auth';
import { AdminRoute } from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AboutPage from './pages/About';
import Contact from './pages/Contact';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow" style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
