import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="aspect-square overflow-hidden bg-[#7E69AB]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-xl font-medium text-gray-900">
            {formatPrice(product.price)}
          </p>
          <Link to={`/product/${product.id}`}>
            <Button
              className="bg-[#7E69AB] hover:bg-[#9b87f5] text-white rounded-lg px-6"
            >
              Məhsula Bax
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};