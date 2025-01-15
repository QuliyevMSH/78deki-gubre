import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import { CartList } from './cart/CartList';
import { useCartStore } from '@/store/cart';

interface BasketItem {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
  };
}

export const CartSheet = () => {
  const navigate = useNavigate();
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const updateCartItems = useCartStore(state => state.updateItems);

  const fetchBasketItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBasketItems([]);
        updateCartItems([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('basket')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            image,
            category,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const items = data || [];
      setBasketItems(items);
      
      // Update global cart state
      const cartItems = items.map(item => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        image: item.products.image,
        category: item.products.category,
        description: item.products.description,
        quantity: item.quantity
      }));
      updateCartItems(cartItems);
    } catch (error) {
      console.error('Error fetching basket items:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Səbət məlumatları yüklənmədi",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const channel = supabase
        .channel('basket_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'basket',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchBasketItems();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchBasketItems();
    const cleanup = setupRealtimeSubscription();

    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeItem(itemId);
        return;
      }

      const { error } = await supabase
        .from('basket')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      
      // Update local state immediately
      setBasketItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      
      // Trigger a fetch to ensure consistency
      fetchBasketItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Miqdar yenilənmədi",
      });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const { error } = await supabase
        .from('basket')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setBasketItems(prev => prev.filter(item => item.id !== itemId));
      fetchBasketItems(); // Refresh cart data
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul silinmədi",
      });
    }
  };

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Zəhmət olmasa daxil olun",
      });
      navigate("/auth");
      return;
    }

    navigate("/payment");
  };

  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = basketItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Səbətim ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Səbətim ({totalItems})</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-6">
        <CartList
          items={basketItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      </div>

      {basketItems.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex justify-between text-base font-medium">
            <p>Cəmi</p>
            <p>{formatPrice(total)}</p>
          </div>
          <Button 
            className="mt-6 w-full"
            onClick={handleCheckout}
          >
            Sifarişi tamamla
          </Button>
        </div>
      )}
    </SheetContent>
  );
};
