import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  Animated,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

type Category = {
  id: string;
  name: string;
  count: number;
  image: string;
};

// Sample categories data
const categories = [
  { 
    id: '1', 
    name: 'Sofas', 
    count: 24, 
    image: 'https://images.unsplash.com/photo-1555041463-a27bce3118fc' 
  },
  { 
    id: '2', 
    name: 'Chairs', 
    count: 32, 
    image: 'https://images.unsplash.com/photo-1503602642458-2321115e8f1e' 
  },
  { 
    id: '3', 
    name: 'Beds', 
    count: 18, 
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' 
  },
  { 
    id: '4', 
    name: 'Tables', 
    count: 15, 
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c' 
  },
  { 
    id: '5', 
    name: 'Wardrobes', 
    count: 12, 
    image: 'https://images.unsplash.com/photo-1584622650111-993f4269d10f' 
  },
  { 
    id: '6', 
    name: 'Lamps', 
    count: 28, 
    image: 'https://images.unsplash.com/photo-1526170375885-4edd8febfcfb' 
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side + 16px gap

export default function CategoriesScreen() {
  const { colors, radii } = useTheme();
  const router = useRouter();
  const scrollY = new Animated.Value(0);

  const renderCategory = ({ item, index }: { item: Category; index: number }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { 
          backgroundColor: colors.card,
          borderRadius: radii.md,
          marginLeft: index % 2 === 0 ? 0 : 16,
          shadowColor: colors.text,
        }
      ]}
      activeOpacity={0.8}
      onPress={() => router.push(`/categories/${item.id}` as any)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[
          styles.categoryImage,
          { borderTopLeftRadius: radii.md, borderTopRightRadius: radii.md }
        ]} 
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.gradient}
      />
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryName]}>{item.name}</Text>
        <Text style={[styles.itemCount]}>{item.count} items</Text>
      </View>
      <View style={[
        styles.chevronContainer,
        { backgroundColor: colors.primary }
      ]}>
        <ChevronRight size={16} color="white" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Browse Categories</Text>
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: CARD_WIDTH,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  categoryInfo: {
    padding: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
