import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setIsAdmin(false);
      router.replace('/auth');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setIsAdmin(false);
        router.replace('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
      router.replace('/');
    }
  };

  if (isAdmin === null) {
    return (
      <View style={styles.loading}>
        <Text>Checking admin access...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.unauthorized}>
        <Text style={styles.unauthorizedText}>Unauthorized Access</Text>
        <Text>You don't have permission to access the admin panel.</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="products" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="users" />
      <Stack.Screen name="categories" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorized: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF3B30',
  },
});