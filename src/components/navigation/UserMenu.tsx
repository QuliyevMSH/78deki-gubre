import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';

interface UserMenuProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

export const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  return user ? (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/profile">
          <UserIcon className="h-5 w-5" />
        </Link>
      </Button>
      <Button variant="default" onClick={onSignOut}>
        Hesabdan çıx
      </Button>
    </div>
  ) : (
    <Link to="/auth">
      <Button variant="default">Giriş / Qeydiyyat</Button>
    </Link>
  );
};