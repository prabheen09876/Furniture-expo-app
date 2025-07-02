import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from './theme';

type HeaderProps = {
  title: string;
  subtitle: string;
  onMenuPress?: () => void;
  onCartPress?: () => void;
};

const Header = ({
  title,
  subtitle,
  onMenuPress = () => {},
  onCartPress = () => {},
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={onMenuPress} 
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCartPress}
          style={styles.cartButton}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="cart-outline" 
            size={20} 
            color={theme.colors.white} 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  menuButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.xs,
  },
  cartButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  title: {
    ...theme.text.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.text.caption,
    color: theme.colors.textLight,
  },
});
