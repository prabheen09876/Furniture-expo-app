import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import Header from './Header';
import CategoryList from './Category';
import ProductCard from './ProductCard';
import TabBar from './TabBar';
import SideMenu from './components/SideMenu.new';
import theme from './theme';

// Sample data - replace with your actual data source
const categories = [
  { id: 'all', icon: 'grid', label: 'All' },
  { id: 'chairs', icon: 'chair', label: 'Chairs' },
  { id: 'tables', icon: 'table-furniture', label: 'Tables' },
  { id: 'sofas', icon: 'sofa', label: 'Sofas' },
  { id: 'lamps', icon: 'lamp', label: 'Lamps' },
  { id: 'accessories', icon: 'dots-horizontal', label: 'More' },
];

// Sample product data with placeholder images and size information
const products = [
  {
    id: '1',
    name: 'Minimalist Chair',
    price: 249.99,
    image: null,
    size: 'large' as const,  // This will be a large card
  },
  {
    id: '2',
    name: 'Modern Table Lamp',
    price: 89.99,
    image: null,
    size: 'small' as const,  // This will be a small card
  },
  {
    id: '3',
    name: 'Wooden Coffee Table',
    price: 349.99,
    image: null,
    size: 'small' as const,  // This will be a small card
  },
  {
    id: '4',
    name: 'Leather Sofa',
    price: 1299.99,
    image: null,
    size: 'large' as const,  // This will be a large card
  },
  {
    id: '5',
    name: 'Floor Lamp',
    price: 179.99,
    image: null,
    size: 'small' as const,  // This will be a small card
  },
  {
    id: '6',
    name: 'Bookshelf',
    price: 289.99,
    image: null,
    size: 'small' as const,  // This will be a small card
  },
  {
    id: '7',
    name: 'Dining Table Set',
    price: 899.99,
    image: null,
    size: 'large' as const,  // This will be a large card
  },
  {
    id: '8',
    name: 'Accent Chair',
    price: 199.99,
    image: null,
    size: 'small' as const,  // This will be a small card
  },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Toggle side menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsMenuVisible(false);
  };

  // Filter products based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      // In a real app, you would filter based on the category
      // For now, we'll just return all products
      setFilteredProducts(products);
    }
  }, [activeCategory]);

  // Handle favorite button press
  const handleFavoritePress = (productId: string, isFavorite: boolean) => {
    setFavorites(prev => 
      isFavorite 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle product press
  const handleProductPress = (productId: string) => {
    console.log('Product pressed:', productId);
    // Navigate to product detail screen with the product ID
    router.push({
      pathname: `/product/[id]`,
      params: { id: productId }
    });
  };

  // Create two columns for the masonry layout
  const createColumns = (items: typeof filteredProducts) => {
    const columns: typeof items[] = [[], []];
    const columnHeights = [0, 0];
    
    // Sort items by size (large items first)
    const sortedItems = [...items].sort((a, b) => {
      if (a.size === b.size) return 0;
      return a.size === 'large' ? -1 : 1;
    });
    
    // Distribute items into columns based on height
    sortedItems.forEach(item => {
      // Calculate item height based on size
      const itemHeight = item.size === 'large' ? 300 : 200; // Adjust these values as needed
      
      // Find the column with the minimum height
      const minHeightIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
      
      // Add item to the column with minimum height
      columns[minHeightIndex].push(item);
      
      // Update the column's height
      columnHeights[minHeightIndex] += itemHeight;
    });
    
    return columns;
  };
  
  const columns = createColumns(filteredProducts);

  return (
    <View style={styles.container}>
      <Header 
        title="Modern Furniture"
        subtitle="Discover the perfect pieces for your home"
        onMenuPress={toggleMenu}
        onCartPress={() => console.log('Cart pressed')}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryList
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategorySelect}
        />
        
        <View style={styles.section}>
          {/* <Header 
            title="Furniture"
            subtitle="Discover our collection"
            onMenuPress={toggleMenu}
          /> */}
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <View style={styles.masonryContainer}>
            {columns.map((column, colIndex) => (
              <View key={`column-${colIndex}`} style={styles.column}>
                {column.map((product) => (
                  <View key={product.id} style={[
                    styles.masonryItem,
                    product.size === 'large' ? styles.largeItem : styles.smallItem
                  ]}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      isFavorite={favorites.includes(product.id)}
                      onPress={() => handleProductPress(product.id)}
                      onFavoritePress={() => 
                        handleFavoritePress(product.id, favorites.includes(product.id))
                      }
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* <TabBar onSearchPress={toggleMenu} /> */}
      <SideMenu 
        isVisible={isMenuVisible} 
        onClose={toggleMenu} 
        onCategorySelect={handleCategorySelect}
        selectedCategory={activeCategory}
        onSortChange={(sortBy: string) => {
          console.log('Sort by:', sortBy);
          // Handle sort change
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space at the bottom
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.text.h2,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -theme.spacing.sm,
  },
  column: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  masonryItem: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  smallItem: {
    height: 200, // Adjust height for small items
  },
  largeItem: {
    height: 300, // Adjust height for large items
  },
});
