import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (userId?: string): Promise<boolean> => {
    const userIdToCheck = userId || user?.id;
    if (!userIdToCheck) return false;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userIdToCheck)
        .eq('is_active', true);

      // Check if data exists and has at least one row
      const adminStatus = !error && data && data.length > 0;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      if (data.user) {
        await checkAdminStatus(data.user.id);
      }
      
      console.log('Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: undefined,
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      console.log('Sign up successful:', data.user?.email);
      
      // If this is the admin user, add admin privileges
      if (data.user && email.trim().toLowerCase() === 'admin@example.com') {
        try {
          const { error: adminError } = await supabase
            .from('admin_users')
            .upsert({
              id: data.user.id,
              role: 'super_admin',
              permissions: ['products:read', 'products:write', 'orders:read', 'orders:write', 'users:read', 'users:write', 'categories:read', 'categories:write'],
              is_active: true,
            });
          
          if (adminError) {
            console.error('Error adding admin privileges:', adminError);
          } else {
            console.log('Admin privileges added successfully');
            await checkAdminStatus(data.user.id);
          }
        } catch (adminError) {
          console.error('Exception adding admin privileges:', adminError);
        }
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created but email not confirmed. Check Supabase settings.');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      setIsAdmin(false);
    } catch (error) {
      console.error('Sign out exception:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      isAdmin,
      checkAdminStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};