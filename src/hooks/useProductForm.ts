import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types";

export const useProductForm = (onSuccess: () => void) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const { toast } = useToast();

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          image: newProduct.image,
          category: newProduct.category,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul əlavə edildi",
      });

      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul əlavə edilmədi",
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          image: updatedProduct.image,
          category: updatedProduct.category,
        })
        .eq("id", updatedProduct.id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul yeniləndi",
      });

      setEditingProduct(null);
      onSuccess();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul yenilənmədi",
      });
    }
  };

  return {
    editingProduct,
    setEditingProduct,
    newProduct,
    setNewProduct,
    handleAddProduct,
    handleUpdateProduct,
  };
};