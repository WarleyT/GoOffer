import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppUser } from "../types";
import { demoStore } from "./demoStore";
import { isSupabaseConfigured, supabase } from "./supabase";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  mode: "supabase" | "demo";
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mode = isSupabaseConfigured ? "supabase" : "demo";

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!supabase) {
        if (mounted) {
          setUser(demoStore.currentUser());
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        await supabase.auth.signOut({ scope: "local" });
      }
      const authUser = data.session?.user;
      if (!mounted) return;
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          username: String(authUser.user_metadata?.username || authUser.email?.split("@")[0] || ""),
          isDemo: false
        });
      }
      setLoading(false);
    }

    void bootstrap();

    if (!supabase) return () => {
      mounted = false;
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      setUser(
        authUser
          ? {
              id: authUser.id,
              email: authUser.email || "",
              username: String(authUser.user_metadata?.username || authUser.email?.split("@")[0] || ""),
              isDemo: false
            }
          : null
      );
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      mode,
      async signIn(email, password) {
        if (!supabase) {
          setUser(demoStore.login(email));
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
      },
      async signUp(email, password, username) {
        if (!supabase) {
          setUser(demoStore.login(email, username));
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });
        if (error) throw new Error(error.message);
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            username,
            display_name: username
          });
          if (profileError) console.warn("Profile initialization failed:", profileError.message);
        }
      },
      async signOut() {
        if (!supabase) {
          demoStore.logout();
          setUser(null);
          return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
      }
    }),
    [loading, mode, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
