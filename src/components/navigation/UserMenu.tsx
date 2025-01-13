import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { User as UserIcon, LogOut } from 'lucide-react';

interface UserMenuProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

export const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  return user ? (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
        <Link to="/profile">
          <UserIcon className="h-5 w-5" />
        </Link>
      </Button>
      <Button 
        variant="default" 
        onClick={onSignOut}
        className="hidden sm:flex"
      >
        Hesabdan çıx
      </Button>
      <div className="flex gap-2 sm:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
        >
          <Link to="/profile">
            <UserIcon className="h-5 w-5" />
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSignOut}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  ) : (
    <Link to="/auth">
      <Button variant="default">Giriş / Qeydiyyat</Button>
    </Link>
  );
};