import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, Bell, Star, ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

type Product = Database['public']['Tables']['products']['Row'];

const { width: screenWidth } = Dimensions.get('window');

const categories = [
  { id: 'chairs', name: 'Chairs', icon: '🪑' },
  { id: 'tables', name: 'Tables', icon: '🪑' },
  { id: 'lamps', name: 'Lamps', icon: '💡' },
  { id: 'decor', name: 'Decor', icon: '🏺' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!user) {
    return (
      <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Welcome to Casa</Text>
          <Text style={styles.authSubtitle}>Please sign in to continue</Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.title}>Casa</Text>
            <Text style={styles.subtitle}>Beautiful furniture for your home</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/cart')}
            >
              <ShoppingCart size={20} color="#2D1B16" strokeWidth={2} />
              {getTotalItems() > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#2D1B16" strokeWidth={2} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity onPress={() => router.push('/search')}>
          <BlurView intensity={20} style={styles.searchContainer}>
            <Search size={18} color="#8B7355" strokeWidth={2} />
            <Text style={styles.searchPlaceholder}>Search furniture...</Text>
          </BlurView>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/categories?filter=${category.id}`)}
              >
                <BlurView intensity={30} style={styles.categoryCardInner}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.productsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <BlurView intensity={40} style={styles.productCardInner}>
                  <View style={styles.productImageContainer}>
                    <Image source={{ uri: product.image_url }} style={styles.productImage} />
                    {product.original_price && product.original_price > product.price && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.productFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>${product.price}</Text>
                        <View style={styles.ratingContainer}>
                          <Star size={12} color="#FFD700" fill="#FFD700" strokeWidth={2} />
                          <Text style={styles.rating}>{product.rating?.toFixed(1) || '0.0'}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                      >
                        <ShoppingCart size={14} color="#FFFFFF" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7355',
    maxWidth: 200,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B47',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B47',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 30,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#8B7355',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
  },
  categoryCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D1B16',
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (screenWidth - 50) / 2,
    marginBottom: 20,
  },
  productCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B47',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D1B16',
    marginBottom: 8,
    lineHeight: 18,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#8B7355',
    marginLeft: 4,
    fontWeight: '500',
  },
  addToCartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D1B16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 32,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#2D1B16',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});