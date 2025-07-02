import { Tabs } from 'expo-router';
import { Chrome as Home, Grid3x3, Heart, User, ShoppingCart } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useCart } from '@/contexts/CartContext';

function TabBarIcon({ icon: Icon, color, focused }: { icon: any; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Icon size={20} color={color} strokeWidth={2} />
    </View>
  );
}

function CartTabBarIcon({ color, focused }: { color: string; focused: boolean }) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <ShoppingCart size={20} color={color} strokeWidth={2} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <View style={styles.badgeInner} />
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={95} style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#2D1B16',
        tabBarInactiveTintColor: '#8B7355',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Grid3x3} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CartTabBarIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Heart} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(45, 27, 22, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B47',
  },
  badgeInner: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF6B47',
  },
});