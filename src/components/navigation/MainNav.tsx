import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

interface MainNavProps {
  isAdmin: boolean;
  className?: string;
}

export const MainNav = ({ isAdmin, className = "" }: MainNavProps) => {
  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      <RouterLink to="/" className="nav-link">
        Ana Səhifə
      </RouterLink>
      
      <RouterLink to="/" className="nav-link">
        Məhsullar
      </RouterLink>
      
      <RouterLink to="/about" className="nav-link">
        Haqqımızda
      </RouterLink>
      
      <RouterLink to="/contact" className="nav-link">
        Əlaqə
      </RouterLink>
      
      {isAdmin && (
        <RouterLink to="/admin" className="nav-link">
          Admin Panel
        </RouterLink>
      )}
    </nav>
  );
};