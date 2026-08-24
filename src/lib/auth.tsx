import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";

export type Role = "farmer" | "store";

export type Profile = {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  state: string | null;
  district: string | null;
  village: string | null;
  photo_url: string | null;
  language: string;
};

export type Store = {
  id: string;
  owner_id: string | null;
  store_name: string;
  owner_name: string;
  mobile: string;
  email: string | null;
  state: string | null;
  district: string | null;
  address: string | null;
  pincode: string | null;
  gst_number: string | null;
  license_details: string | null;
  opening_hours: string | null;
  image_url: string | null;
  description: string | null;
  rating: number;
  is_open: boolean;
};

export function mobileToEmail(mobile: string) {
  return `${mobile.replace(/\D/g, "")}@bharatsanagro.in`;
}

export function isValidMobile(mobile: string) {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ""));
}

type AuthValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: Role | null;
  profile: Profile | null;
  store: Store | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const loadAccount = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setRole(null);
      setProfile(null);
      setStore(null);
      return;
    }
    const [roleRes, profileRes, storeRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("stores").select("*").eq("owner_id", userId).maybeSingle(),
    ]);
    setRole((roleRes.data?.role as Role | undefined) ?? null);
    setProfile((profileRes.data as Profile | null) ?? null);
    setStore((storeRes.data as Store | null) ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      await loadAccount(data.session?.user.id);
      if (active) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (
        event !== "SIGNED_IN" &&
        event !== "SIGNED_OUT" &&
        event !== "USER_UPDATED" &&
        event !== "TOKEN_REFRESHED"
      ) {
        return;
      }
      setSession(nextSession ?? null);
      void loadAccount(nextSession?.user.id);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        void router.invalidate();
        if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadAccount, queryClient, router]);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session ?? null);
    await loadAccount(data.session?.user.id);
  }, [loadAccount]);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
    setProfile(null);
    setStore(null);
  }, [queryClient]);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      role,
      profile,
      store,
      refresh,
      signOut,
    }),
    [loading, session, role, profile, store, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function homePathForRole(role: Role | null) {
  if (role === "store") return "/store/dashboard";
  if (role === "farmer") return "/dashboard";
  return "/";
}
