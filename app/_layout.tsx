import { Slot, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import TabBar from './TabBar';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import theme from './theme'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <View style={styles.content}>
                <Slot />
              </View>
              <TabBar onSearchPress={() => router.replace('/search')} />
              <StatusBar style="dark" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
});