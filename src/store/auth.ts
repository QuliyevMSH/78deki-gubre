import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));

// Initialize auth state
const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (session?.user) {
      useAuthStore.getState().setUser(session.user);
    } else {
      useAuthStore.getState().setUser(null);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuthStore.getState().setUser(null);
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

// Initialize auth state immediately
initializeAuth();

// Listen for auth changes
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    useAuthStore.getState().setUser(null);
  } else if (session?.user) {
    useAuthStore.getState().setUser(session.user);
  }
});

// Cleanup subscription when the app unmounts
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    subscription.unsubscribe();
  });
}