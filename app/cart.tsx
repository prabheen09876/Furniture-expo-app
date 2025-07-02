import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';

export default function CartScreen() {
  const { colors, radii } = useTheme();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Cart Items */}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={{
            margin: 16,
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: radii.md,
            flexDirection: 'row'
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text }}>{item.products.name}</Text>
              <Text style={{ color: colors.text }}>₹{item.products.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                <Text style={{ fontSize: 20, padding: 8 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ paddingHorizontal: 8 }}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                <Text style={{ fontSize: 20, padding: 8 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Checkout Button */}
      <TouchableOpacity style={{
        margin: 16,
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: radii.md,
        alignItems: 'center'
      }}>
        <Text style={{ color: 'white' }}>Proceed to Checkout (₹{getTotalPrice()})</Text>
      </TouchableOpacity>
    </View>
  );
}
