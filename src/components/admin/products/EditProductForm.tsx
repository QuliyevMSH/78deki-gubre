import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditProductFormProps {
  product: Product | null;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

export const EditProductForm = ({
  product,
  onClose,
  onUpdate,
}: EditProductFormProps) => {
  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const updatedProduct = {
      ...product,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
    };

    onUpdate(updatedProduct);
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Məhsulu Redaktə Et</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product.name}
              placeholder="Məhsulun adı"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Qiymət</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={product.price}
              placeholder="Qiymət"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product.description}
              placeholder="Məhsul haqqında məlumat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Şəkil URL</Label>
            <Input
              id="image"
              name="image"
              defaultValue={product.image}
              placeholder="Şəklin linki"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kateqoriya</Label>
            <Input
              id="category"
              name="category"
              defaultValue={product.category}
              placeholder="Kateqoriya"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit">
              Yadda saxla
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};