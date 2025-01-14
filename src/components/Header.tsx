import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { CartSheet } from './CartSheet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { MainNav } from './navigation/MainNav';
import { MobileNav } from './navigation/MobileNav';
import { UserMenu } from './navigation/UserMenu';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cartItems = useCartStore((state) => state.items);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async () => {
      try {
        if (!user) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAdmin(data?.role === 'admin');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (mounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setIsAdmin(false);
          setIsLoading(false);
        }
      } else if (session?.user) {
        checkAdminStatus();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  const renderLogo = () => (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" 
        alt="GübrəEvi Logo" 
        className="h-8 w-8"
      />
      <span className="text-2xl font-bold text-primary">GübrəEvi</span>
    </Link>
  );

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {renderLogo()}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {renderLogo()}
            <MainNav isAdmin={isAdmin} className="ml-8" />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <div className="text-xs font-medium text-primary-foreground">
                        {cartItemsCount}
                      </div>
                    </div>
                  )}
                </Button>
              </SheetTrigger>
              <CartSheet />
            </Sheet>

            <UserMenu user={user} onSignOut={handleSignOut} />

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <MobileNav 
                isOpen={isMenuOpen} 
                onOpenChange={setIsMenuOpen}
                isAdmin={isAdmin}
              />
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};