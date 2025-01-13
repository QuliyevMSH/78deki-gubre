import { Link as RouterLink } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

export const MobileNav = ({ isOpen, onOpenChange, isAdmin }: MobileNavProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <RouterLink
            to="/"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Ana Səhifə
          </RouterLink>
          
          <RouterLink 
            to="/" 
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Məhsullar
          </RouterLink>
          
          <RouterLink
            to="/about"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Haqqımızda
          </RouterLink>
          
          <RouterLink 
            to="/contact" 
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Əlaqə
          </RouterLink>
          
          {isAdmin && (
            <RouterLink
              to="/admin"
              className="nav-link"
              onClick={() => onOpenChange(false)}
            >
              Admin Panel
            </RouterLink>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};