import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardView } from "@/components/admin/dashboard/DashboardView";
import { AddProductForm } from "@/components/admin/products/AddProductForm";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { EditProductForm } from "@/components/admin/products/EditProductForm";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi",
      });
    }
  };

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

      fetchProducts();
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
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul yenilənmədi",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // First, delete all basket items referencing this product
      const { error: basketError } = await supabase
        .from("basket")
        .delete()
        .eq("product_id", id);

      if (basketError) {
        console.error("Error deleting basket items:", basketError);
        throw basketError;
      }

      // Then delete the product
      const { error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (productError) {
        console.error("Error deleting product:", productError);
        throw productError;
      }

      toast({
        title: "Uğurlu",
        description: "Məhsul silindi",
      });

      setProducts(prev => prev.filter(product => product.id !== id));
      setFilteredProducts(prev => prev.filter(product => product.id !== id));
    } catch (error: any) {
      console.error("Error in delete operation:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Məhsul silinmədi",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="pl-[240px] p-8">
        <div className="max-w-[1200px] mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardView
                  filteredProducts={filteredProducts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
            <Route
              path="/add"
              element={
                <AddProductForm
                  newProduct={newProduct}
                  setNewProduct={setNewProduct}
                  handleAddProduct={handleAddProduct}
                />
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <ProductsTable
                    products={products}
                    setEditingProduct={setEditingProduct}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                  <EditProductForm
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateProduct}
                  />
                </>
              }
            />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}