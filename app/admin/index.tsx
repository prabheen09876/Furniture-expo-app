import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Grid3x3,
  Settings,
  BarChart3
} from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        productsResult,
        ordersResult,
        usersResult,
        revenueResult,
        pendingOrdersResult,
        lowStockResult
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('products').select('id', { count: 'exact' }).lt('stock_quantity', 10)
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalRevenue,
        pendingOrders: pendingOrdersResult.count || 0,
        lowStockProducts: lowStockResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Products',
      icon: Package,
      route: '/admin/products',
      color: '#4F46E5',
      description: 'Manage product catalog'
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      route: '/admin/orders',
      color: '#059669',
      description: 'Track and manage orders'
    },
    {
      title: 'Users',
      icon: Users,
      route: '/admin/users',
      color: '#DC2626',
      description: 'Manage user accounts'
    },
    {
      title: 'Categories',
      icon: Grid3x3,
      route: '/admin/categories',
      color: '#7C2D12',
      description: 'Organize product categories'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      route: '/admin/analytics',
      color: '#9333EA',
      description: 'View sales analytics'
    },
    {
      title: 'Settings',
      icon: Settings,
      route: '/admin/settings',
      color: '#374151',
      description: 'System configuration'
    },
  ];

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: '#4F46E5',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: '#059669',
      change: '+8%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: '#DC2626',
      change: '+15%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#7C2D12',
      change: '+23%'
    },
  ];

  return (
    <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your furniture store</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statCards.map((stat, index) => (
            <BlurView key={index} intensity={40} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <stat.icon size={24} color={stat.color} strokeWidth={2} />
                </View>
                <View style={styles.statChange}>
                  <TrendingUp size={12} color="#059669" strokeWidth={2} />
                  <Text style={styles.changeText}>{stat.change}</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </BlurView>
          ))}
        </View>

        {/* Alert Cards */}
        <View style={styles.alertsContainer}>
          <BlurView intensity={40} style={[styles.alertCard, styles.warningAlert]}>
            <Text style={styles.alertTitle}>Pending Orders</Text>
            <Text style={styles.alertValue}>{stats.pendingOrders}</Text>
            <Text style={styles.alertDescription}>Orders awaiting processing</Text>
          </BlurView>
          
          <BlurView intensity={40} style={[styles.alertCard, styles.dangerAlert]}>
            <Text style={styles.alertTitle}>Low Stock</Text>
            <Text style={styles.alertValue}>{stats.lowStockProducts}</Text>
            <Text style={styles.alertDescription}>Products below 10 units</Text>
          </BlurView>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <BlurView intensity={40} style={styles.menuItemInner}>
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                    <item.icon size={28} color={item.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 20,
    width: (screenWidth - 50) / 2,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#8B7355',
  },
  alertsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  alertCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  warningAlert: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  dangerAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 4,
  },
  alertValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: '#8B7355',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (screenWidth - 50) / 2,
    marginBottom: 16,
  },
  menuItemInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
});