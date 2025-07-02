export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          slug: string;
          is_active: boolean | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          slug: string;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          slug?: string;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          image_url: string;
          images: string[] | null;
          category_id: string | null;
          category: string | null;
          sku: string | null;
          brand: string | null;
          rating: number | null;
          review_count: number | null;
          in_stock: boolean | null;
          stock_quantity: number | null;
          weight: number | null;
          dimensions: any | null;
          materials: string[] | null;
          colors: string[] | null;
          tags: string[] | null;
          is_featured: boolean | null;
          is_active: boolean | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          image_url: string;
          images?: string[] | null;
          category_id?: string | null;
          category?: string | null;
          sku?: string | null;
          brand?: string | null;
          rating?: number | null;
          review_count?: number | null;
          in_stock?: boolean | null;
          stock_quantity?: number | null;
          weight?: number | null;
          dimensions?: any | null;
          materials?: string[] | null;
          colors?: string[] | null;
          tags?: string[] | null;
          is_featured?: boolean | null;
          is_active?: boolean | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          image_url?: string;
          images?: string[] | null;
          category_id?: string | null;
          category?: string | null;
          sku?: string | null;
          brand?: string | null;
          rating?: number | null;
          review_count?: number | null;
          in_stock?: boolean | null;
          stock_quantity?: number | null;
          weight?: number | null;
          dimensions?: any | null;
          materials?: string[] | null;
          colors?: string[] | null;
          tags?: string[] | null;
          is_featured?: boolean | null;
          is_active?: boolean | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: string;
          total_amount: number;
          subtotal: number;
          tax_amount: number | null;
          shipping_amount: number | null;
          discount_amount: number | null;
          currency: string | null;
          payment_status: string | null;
          payment_method: string | null;
          shipping_address: any;
          billing_address: any | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: string;
          total_amount: number;
          subtotal: number;
          tax_amount?: number | null;
          shipping_amount?: number | null;
          discount_amount?: number | null;
          currency?: string | null;
          payment_status?: string | null;
          payment_method?: string | null;
          shipping_address: any;
          billing_address?: any | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: string;
          total_amount?: number;
          subtotal?: number;
          tax_amount?: number | null;
          shipping_amount?: number | null;
          discount_amount?: number | null;
          currency?: string | null;
          payment_status?: string | null;
          payment_method?: string | null;
          shipping_address?: any;
          billing_address?: any | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          product_snapshot?: any | null;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          role: string;
          permissions: string[] | null;
          is_active: boolean | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id: string;
          role?: string;
          permissions?: string[] | null;
          is_active?: boolean | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          permissions?: string[] | null;
          is_active?: boolean | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          comment: string | null;
          images: string[] | null;
          is_verified: boolean | null;
          is_approved: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          comment?: string | null;
          images?: string[] | null;
          is_verified?: boolean | null;
          is_approved?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          comment?: string | null;
          images?: string[] | null;
          is_verified?: boolean | null;
          is_approved?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}