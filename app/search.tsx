import { View, Text, TextInput, FlatList } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
};

export default function SearchScreen() {
  const { colors, radii } = useTheme();
  
  // Temporary empty data for type safety
  const data: Product[] = [];
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Bar */}
      <TextInput 
        placeholder="Search furniture..."
        style={{
          margin: 16,
          padding: 12,
          backgroundColor: colors.card,
          borderRadius: radii.md,
        }}
      />
      
      {/* Results */}
      <FlatList
        data={data}
        renderItem={({ item }) => <ProductCard 
          id={item.id}
          name={item.name}
          price={item.price}
          image={item.image ? { uri: item.image } : null}
        />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
