import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Store } from "@/lib/auth";
import type { BookingStatus } from "@/lib/catalog";

export type Product = {
  id: string;
  store_id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  quantity: number;
  unit: string | null;
  mfg_date: string | null;
  expiry_date: string | null;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type ProductWithStore = Product & { stores: Store | null };

export type Booking = {
  id: string;
  booking_code: string;
  farmer_id: string;
  farmer_name: string;
  farmer_mobile: string;
  product_id: string;
  store_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  stores?: Store | null;
};

export type Review = {
  id: string;
  user_id: string;
  author_name: string;
  rating: number;
  category: string;
  comment: string | null;
  created_at: string;
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, stores(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ProductWithStore[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, stores(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as ProductWithStore | null;
    },
  });
}

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*, products(id, category, is_available)")
        .order("store_name");
      if (error) throw error;
      return (data ?? []) as unknown as (Store & {
        products: { id: string; category: string; is_available: boolean }[];
      })[];
    },
  });
}

export function useStore(id: string) {
  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Store | null;
    },
  });
}

export function useStoreProducts(storeId: string | undefined) {
  return useQuery({
    queryKey: ["store-products", storeId],
    enabled: Boolean(storeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });
}

export function useMyBookings(farmerId: string | undefined) {
  return useQuery({
    queryKey: ["my-bookings", farmerId],
    enabled: Boolean(farmerId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, stores(*)")
        .eq("farmer_id", farmerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Booking[];
    },
  });
}

export function useStoreBookings(storeId: string | undefined) {
  return useQuery({
    queryKey: ["store-bookings", storeId],
    enabled: Boolean(storeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("store_id", storeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Booking[];
    },
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as unknown as Review[];
    },
  });
}
