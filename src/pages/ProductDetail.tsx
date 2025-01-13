import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import CommentSection from '@/components/comments/CommentSection';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id as string))
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast({
            variant: "destructive",
            title: "Xəta",
            description: "Məhsul tapılmadı",
          });
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Məhsul tapılmadı",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleAddToCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Zəhmət olmasa daxil olun",
        });
        return;
      }

      if (!product) return;

      const { data: existingItem, error: fetchError } = await supabase
        .from('basket')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', parseInt(id as string))
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const { error: updateError } = await supabase
          .from('basket')
          .update({ 
            quantity: newQuantity,
          })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('basket')
          .insert({
            user_id: user.id,
            product_id: parseInt(id as string),
            quantity: quantity
          });

        if (insertError) throw insertError;
      }

      // Update local cart state immediately
      addItem(product, quantity);

      toast({
        title: "Uğurlu",
        description: "Məhsul səbətə əlavə edildi",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Səbətə əlavə edilmədi",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container">
          <p className="text-center text-lg">Məhsul tapılmadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-green-50">
      <div className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-white p-8">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-3xl font-medium text-green-600">
              {formatPrice(product.price * quantity)}
            </p>
            <p className="mt-4 text-gray-600">{product.description}</p>

            <div className="mt-8">
              <p className="text-sm font-medium text-gray-900">MİQDAR</p>
              <div className="mt-2 flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-green-200 hover:bg-green-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-green-200 hover:bg-green-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              className="mt-8 bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={handleAddToCart}
            >
              Səbətə əlavə et
            </Button>

            <div className="mt-8 flex items-center space-x-4">
              <span className="text-sm text-gray-600">Paylaş:</span>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <CommentSection />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;