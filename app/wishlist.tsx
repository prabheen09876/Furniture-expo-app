import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, ShoppingCart, ChevronRight } from 'lucide-react-native';
import theme from './theme';
import { useWishlist } from '@/contexts/WishlistContext';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
  products: Product;
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32; // 16px padding on each side

export default function WishlistScreen() {
  const router = useRouter();
  const { items: wishlist, removeFromWishlist } = useWishlist();

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Heart size={48} color={theme.colors.textLight} />
      <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptyText}>Save items you love to your wishlist</Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.itemImageContainer}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image 
          source={{ uri: item.products.image_url }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
      </TouchableOpacity>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.products.name}</Text>
        <Text style={styles.itemPrice}>
          ₹{item.products.price.toFixed(2)}
        </Text>
        
        <View style={styles.itemActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Add to cart logic here
            }}
          >
            <ShoppingCart size={16} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.count}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      
      {wishlist.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  count: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  itemImageContainer: {
    width: 120,
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: theme.colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 71, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
});
