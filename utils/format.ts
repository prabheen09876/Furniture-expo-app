/**
 * Formats a number as a price string with 2 decimal places and comma separators
 * @param price - The price to format
 * @returns Formatted price string with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Formats a number to show in a shortened format (e.g., 1.2k, 3.4m)
 * @param num - The number to format
 * @returns Formatted string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
