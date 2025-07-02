import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Star } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { PRODUCTS as products, Product } from '../data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { colors, radii } = theme;

  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p: Product) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header Section with Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {product.images.map((img, index) => (
              <View key={index} style={styles.slide}>
                <Image
                  source={{ uri: img }}
                  style={[styles.productImage, { borderRadius: radii.lg }]}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.gradient}
          />
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wishlistButton, { backgroundColor: colors.card }]}
            onPress={toggleFavorite}
          >
            <Heart
              size={24}
              color={isFavorite ? colors.primary : colors.text}
              fill={isFavorite ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Product Info Section */}
        <View style={[styles.infoContainer, { padding: 24, backgroundColor: colors.background }]}>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
          <View style={styles.flexRow}>
            <View style={[styles.ratingContainer, { backgroundColor: colors.card }]}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{product.rating}</Text>
            </View>
          </View>
          <Text style={[styles.description, { color: colors.text, marginTop: 16 }]}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.tabBarButton}>
          <Text style={{ color: colors.text, fontWeight: 'bold' }}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBarButton, { backgroundColor: colors.primary }]}>
          <Text style={{ color: colors.background, fontWeight: 'bold' }}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // Space for the fixed tab bar
  },
  imageContainer: {
    height: SCREEN_WIDTH * 1.1,
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  tabBarButton: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButtonText: {
    fontWeight: '600',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 50,
    paddingBottom: 12,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  animatedHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
});

export default ProductDetailScreen;