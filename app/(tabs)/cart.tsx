import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartScreen() {
  const { user } = useAuth();
  const { items, loading, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (!user) {
    return (
      <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign in Required</Text>
          <Text style={styles.authSubtitle}>Please sign in to view your cart</Text>
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

  if (items.length === 0) {
    return (
      <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#2D1B16" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Cart</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some furniture to get started</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/categories')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#2D1B16" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Cart ({items.length})</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Cart Items */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <BlurView key={item.id} intensity={40} style={styles.cartItem}>
              <Image source={{ uri: item.products.image_url }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.products.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={1}>
                  {item.products.description}
                </Text>
                <Text style={styles.itemPrice}>${item.products.price}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} color="#FF6B47" strokeWidth={2} />
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={14} color="#2D1B16" strokeWidth={2} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} color="#2D1B16" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          ))}
        </View>
      </ScrollView>

      {/* Checkout Section */}
      <BlurView intensity={95} style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D1B16',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: 20,
  },
  cartItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B16',
  },
  itemActions: {
    alignItems: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 71, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D1B16',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  checkoutContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D1B16',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B16',
  },
  checkoutButton: {
    backgroundColor: '#2D1B16',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 32,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#2D1B16',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 24,
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