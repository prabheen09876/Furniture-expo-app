import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Heart, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  HelpCircle,
  Star
} from 'lucide-react-native';
import theme from './theme';

// Mock user data
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Furniture St, New York, NY 10001',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  orders: 5,
  wishlist: 12,
  memberSince: '2023',
};

const menuItems = [
  { 
    id: 'orders', 
    title: 'My Orders', 
    icon: <ShoppingBag size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/orders')
  },
  { 
    id: 'addresses', 
    title: 'My Addresses', 
    icon: <MapPin size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/addresses')
  },
  { 
    id: 'payment', 
    title: 'Payment Methods', 
    icon: <CreditCard size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/payment-methods')
  },
  { 
    id: 'wishlist', 
    title: 'My Wishlist', 
    icon: <Heart size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/wishlist')
  },
  { 
    id: 'reviews', 
    title: 'My Reviews', 
    icon: <Star size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/reviews')
  },
  { 
    id: 'settings', 
    title: 'Settings', 
    icon: <Settings size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/settings')
  },
  { 
    id: 'help', 
    title: 'Help Center', 
    icon: <HelpCircle size={24} color={theme.colors.text} />,
    onPress: (router: any) => router.push('/help')
  },
];

const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.editButton}>
              <User size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.wishlist}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.memberSince}</Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.onPress(router)}
            >
              <View style={styles.menuIcon}>
                {item.icon}
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <ChevronRight size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    ...theme.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.background,
    marginVertical: 8,
  },
  menuContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.muted,
  },
});

export default ProfileScreen;
