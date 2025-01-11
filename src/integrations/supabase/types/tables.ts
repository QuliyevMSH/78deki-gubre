import { Json } from './json';
import { UserRole } from './enums';

export interface Tables {
  comments: {
    Row: {
      id: number;
      content: string;
      created_at: string;
      user_id: string;
      product_id: number;
      parent_id: number | null;
    };
    Insert: {
      id?: number;
      content: string;
      created_at?: string;
      user_id: string;
      product_id: number;
      parent_id?: number | null;
    };
    Update: {
      id?: number;
      content?: string;
      created_at?: string;
      user_id?: string;
      product_id?: number;
      parent_id?: number | null;
    };
    Relationships: [
      {
        foreignKeyName: "comments_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "comments_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "products";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "comments_parent_id_fkey";
        columns: ["parent_id"];
        isOneToOne: false;
        referencedRelation: "comments";
        referencedColumns: ["id"];
      }
    ];
  };
  basket: {
    Row: {
      created_at: string;
      id: number;
      product_id: number | null;
      quantity: number;
      user_id: string | null;
    };
    Insert: {
      created_at?: string;
      id?: number;
      product_id?: number | null;
      quantity?: number;
      user_id?: string | null;
    };
    Update: {
      created_at?: string;
      id?: number;
      product_id?: number | null;
      quantity?: number;
      user_id?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "basket_product_id_fkey";
        columns: ["product_id"];
        isOneToOne: false;
        referencedRelation: "products";
        referencedColumns: ["id"];
      }
    ];
  };
  feddback: {
    Row: {
      content: string;
      id: number;
    };
    Insert: {
      content: string;
      id?: number;
    };
    Update: {
      content?: string;
      id?: number;
    };
    Relationships: [];
  };
  products: {
    Row: {
      category: string;
      description: string;
      id: number;
      image: string;
      name: string;
      price: number;
    };
    Insert: {
      category: string;
      description: string;
      id?: number;
      image: string;
      name: string;
      price: number;
    };
    Update: {
      category?: string;
      description?: string;
      id?: number;
      image?: string;
      name?: string;
      price?: number;
    };
    Relationships: [];
  };
  profiles: {
    Row: {
      avatar_url: string | null;
      created_at: string;
      feedback: string | null;
      first_name: string | null;
      id: string;
      last_name: string | null;
      role: UserRole;
      updated_at: string | null;
    };
    Insert: {
      avatar_url?: string | null;
      created_at?: string;
      feedback?: string | null;
      first_name?: string | null;
      id: string;
      last_name?: string | null;
      role?: UserRole;
      updated_at?: string | null;
    };
    Update: {
      avatar_url?: string | null;
      created_at?: string;
      feedback?: string | null;
      first_name?: string | null;
      id: string;
      last_name?: string | null;
      role?: UserRole;
      updated_at?: string | null;
    };
    Relationships: [];
  };
}
