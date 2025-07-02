import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Plus, Search, CreditCard as Edit3, Trash2, Eye, Package, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

              if (error) throw error;
              
              setProducts(products.filter(p => p.id !== productId));
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product');
            }
          }
        }
      ]
    );
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
      Alert.alert('Error', 'Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#2D1B16" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <BlurView intensity={40} style={styles.searchBar}>
          <Search size={20} color="#8B7355" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8B7355"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <BlurView intensity={40} style={styles.statCard}>
          <Package size={20} color="#4F46E5" strokeWidth={2} />
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </BlurView>
        
        <BlurView intensity={40} style={styles.statCard}>
          <Eye size={20} color="#059669" strokeWidth={2} />
          <Text style={styles.statValue}>{products.filter(p => p.is_active).length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </BlurView>
        
        <BlurView intensity={40} style={styles.statCard}>
          <DollarSign size={20} color="#DC2626" strokeWidth={2} />
          <Text style={styles.statValue}>{products.filter(p => p.stock_quantity && p.stock_quantity < 10).length}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </BlurView>
      </View>

      {/* Products List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.productsContainer}>
          {filteredProducts.map((product) => (
            <BlurView key={product.id} intensity={40} style={styles.productCard}>
              <Image source={{ uri: product.image_url }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    product.is_active ? styles.activeBadge : styles.inactiveBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      product.is_active ? styles.activeText : styles.inactiveText
                    ]}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productSku}>SKU: {product.sku}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                
                <View style={styles.stockInfo}>
                  <Text style={styles.stockText}>
                    Stock: {product.stock_quantity || 0}
                  </Text>
                  {product.stock_quantity && product.stock_quantity < 10 && (
                    <Text style={styles.lowStockText}>Low Stock</Text>
                  )}
                </View>
              </View>

              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleProductStatus(product)}
                >
                  <Eye size={16} color={product.is_active ? "#059669" : "#8B7355"} strokeWidth={2} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setEditingProduct(product)}
                >
                  <Edit3 size={16} color="#4F46E5" strokeWidth={2} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteProduct(product.id)}
                >
                  <Trash2 size={16} color="#DC2626" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </BlurView>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add/Edit Product Modal */}
      <ProductModal
        visible={showAddModal || !!editingProduct}
        product={editingProduct}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onSave={() => {
          fetchProducts();
          setShowAddModal(false);
          setEditingProduct(null);
        }}
      />
    </LinearGradient>
  );
}

// Product Modal Component
function ProductModal({ 
  visible, 
  product, 
  onClose, 
  onSave 
}: {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category: '',
    sku: '',
    brand: '',
    stock_quantity: '',
    is_active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        image_url: product.image_url || '',
        category: product.category || '',
        sku: product.sku || '',
        brand: product.brand || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        is_active: product.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        image_url: '',
        category: '',
        sku: '',
        brand: '',
        stock_quantity: '',
        is_active: true,
      });
    }
  }, [product]);

  const handleSave = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image_url: formData.image_url,
        category: formData.category,
        sku: formData.sku,
        brand: formData.brand,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_active: formData.is_active,
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
      }

      Alert.alert('Success', `Product ${product ? 'updated' : 'created'} successfully`);
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', `Failed to ${product ? 'update' : 'create'} product`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={['#F5E6D3', '#E8D5C4']} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {product ? 'Edit Product' : 'Add Product'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter product name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Enter product description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Original Price</Text>
              <TextInput
                style={styles.input}
                value={formData.original_price}
                onChangeText={(text) => setFormData({ ...formData, original_price: text })}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
              placeholder="https://example.com/image.jpg"
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="chairs, tables, etc."
              />
            </View>

            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>SKU</Text>
              <TextInput
                style={styles.input}
                value={formData.sku}
                onChangeText={(text) => setFormData({ ...formData, sku: text })}
                placeholder="PROD-001"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Brand</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(text) => setFormData({ ...formData, brand: text })}
                placeholder="Brand name"
              />
            </View>

            <View style={styles.formGroupHalf}>
              <Text style={styles.label}>Stock Quantity</Text>
              <TextInput
                style={styles.input}
                value={formData.stock_quantity}
                onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setFormData({ ...formData, is_active: !formData.is_active })}
            >
              <Text style={styles.toggleLabel}>Active Product</Text>
              <View style={[
                styles.toggle,
                formData.is_active ? styles.toggleActive : styles.toggleInactive
              ]}>
                <View style={[
                  styles.toggleThumb,
                  formData.is_active ? styles.thumbActive : styles.thumbInactive
                ]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D1B16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2D1B16',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B16',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeText: {
    color: '#059669',
  },
  inactiveText: {
    color: '#9CA3AF',
  },
  productCategory: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B16',
    marginBottom: 4,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#8B7355',
  },
  lowStockText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productActions: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8B7355',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D1B16',
  },
  saveButton: {
    fontSize: 16,
    color: '#2D1B16',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D1B16',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D1B16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#2D1B16',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#059669',
  },
  toggleInactive: {
    backgroundColor: '#D1D5DB',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
});