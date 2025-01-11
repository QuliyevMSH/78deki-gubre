export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Comment {
  id: number;
  product_id: number;
  user_id: string;
  content: string;
  parent_id?: number | null;
  created_at: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}