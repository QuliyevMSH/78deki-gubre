import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  id?: string;
}

export const Footer = ({ id }: FooterProps) => {
  return (
    <footer id={id} className="bg-gradient-to-b from-primary/10 to-primary/5 border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" 
                alt="GübrəEvi Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-primary">GübrəEvi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Keyfiyyətli gübrələr, sağlam məhsullar təqdim edirik.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Əlaqə</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+994 12 525 48 48</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@gubre.az</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Bakı şəh., Nərimanov r., Z.Bünyadov Pr.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Keçidlər</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Ana Səhifə</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Məhsullar</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">Haqqımızda</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Əlaqə</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Sosial Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GübrəEvi. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
};