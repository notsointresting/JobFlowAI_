import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path
import { SPACING, FONTS, SIZES, COLORS } from '../constants/theme';

const GridScreen = () => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  const numColumns = SIZES.width > 600 ? 3 : 2; // Example: 3 columns for larger screens/tablets, 2 for phones

  const data = Array.from({ length: 15 }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    color: `hsl(${(i * 30) % 360}, 70%, 80%)`, // Generate some varied background colors
  }));

  const renderGridItem = ({ item }) => (
    <View style={[styles.gridItem, { backgroundColor: item.color }]}>
      <Text style={styles.gridItemText}>{item.title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Responsive Grid Layout</Text>
        <Text style={styles.subtitle}>
          Displaying items in a {numColumns}-column grid.
        </Text>

        <FlatList
          data={data}
          renderItem={renderGridItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          key={numColumns} // Important: Re-render FlatList if numColumns changes
          columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : null}
          // contentContainerStyle={styles.gridContainer} // Not strictly needed if container has padding
          ListEmptyComponent={<Text style={styles.emptyText}>No items to display.</Text>}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme) => {
  const itemMarginHorizontal = SPACING.s;
  const itemMarginBottom = SPACING.m; // Increased bottom margin for better separation
  const numColumns = SIZES.width > 600 ? 3 : 2;

  // Calculate item width based on screen width, container padding, number of columns, and horizontal margins between items
  const totalHorizontalPaddingAndMargins = (SPACING.m * 2) + (itemMarginHorizontal * (numColumns - 1));
  const itemWidth = (SIZES.width - totalHorizontalPaddingAndMargins) / numColumns;

  return StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: SPACING.m, // Apply horizontal padding to the main container
      paddingTop: SPACING.m, // Keep top padding
      paddingBottom: SPACING.l, // Ensure bottom padding for scroll content
    },
    title: {
      ...FONTS.h1,
      color: theme.colors.text,
      marginBottom: SPACING.s,
      textAlign: 'center',
    },
    subtitle: {
      ...FONTS.body2,
      color: theme.colors.textGray,
      textAlign: 'center',
      marginBottom: SPACING.l,
    },
    gridContainer: {
      // No specific padding needed here if container handles it
    },
    // columnWrapperStyle will handle spacing between items in a row for numColumns > 1
    // No specific 'row' style needed if FlatList handles it with columnWrapperStyle for spacing.
    // If you need items to not be flush left/right within the content area of FlatList,
    // then gridContainer padding might be used, or adjust FlatList style itself.
    // For this setup, the main container's padding should suffice.

    gridItem: {
      width: itemWidth,
      height: itemWidth * 1.2, // Make items slightly taller than wide
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: SIZES.radius,
      marginBottom: itemMarginBottom,
      // marginRight is handled by columnWrapperStyle for numColumns > 1.
      // For numColumns = 1, items will take full calculated width.
      // backgroundColor is set dynamically
      // Add a subtle shadow to grid items
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    gridItemText: {
      ...FONTS.h4,
      color: COLORS.black, // Darker text for better contrast on varied backgrounds
      fontWeight: 'bold',
    },
    emptyText: {
      ...FONTS.body1,
      color: theme.colors.textGray,
      textAlign: 'center',
      marginTop: SPACING.xl,
    }
  });
};

export default GridScreen;
