import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { UserManagement } from "@/components/admin/UserManagement";
import { DashboardView } from "@/components/admin/dashboard/DashboardView";
import { AddProductForm } from "@/components/admin/products/AddProductForm";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { EditProductForm } from "@/components/admin/products/EditProductForm";
import { CommentsManagement } from "@/components/admin/comments/CommentsManagement";
import { useProducts } from "@/hooks/useProducts";
import { useProductForm } from "@/hooks/useProductForm";

export default function AdminPanel() {
  const {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    handleDeleteProduct,
    fetchProducts,
  } = useProducts();

  const {
    editingProduct,
    setEditingProduct,
    newProduct,
    setNewProduct,
    handleAddProduct,
    handleUpdateProduct,
  } = useProductForm(fetchProducts);

  return (
    <AdminLayout>
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
        <Route path="/comments" element={<CommentsManagement />} />
      </Routes>
    </AdminLayout>
  );
}