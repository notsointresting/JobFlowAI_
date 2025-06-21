import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { colors: themeColors, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);

  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setFeaturedItems([
        { id: 1, title: 'Modern Design', subtitle: 'Clean & Minimal', icon: 'brush-outline' },
        { id: 2, title: 'Performance', subtitle: 'Fast & Smooth', icon: 'flash-outline' },
        { id: 3, title: 'Responsive', subtitle: 'All Devices', icon: 'phone-portrait-outline' },
        { id: 4, title: 'Accessible', subtitle: 'For Everyone', icon: 'accessibility-outline' },
      ]);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      headerOpacity.value = withTiming(1, { duration: 800 });
      contentTranslateY.value = withSpring(0, { damping: 15 });
    }
  }, [isLoading]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const renderFeaturedItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.featuredItem,
        {
          opacity: useSharedValue(0).value = withDelay(
            index * 100,
            withTiming(1, { duration: 600 })
          ),
        },
      ]}
    >
      <Card
        style={[styles.featureCard, { backgroundColor: themeColors.surface }]}
        onPress={() => navigation.navigate('Detail', { item })}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={item.icon} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.featureTitle, { color: themeColors.textPrimary }]}>
          {item.title}
        </Text>
        <Text style={[styles.featureSubtitle, { color: themeColors.textSecondary }]}>
          {item.subtitle}
        </Text>
      </Card>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <LoadingSpinner size={60} />
        <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>
          Loading amazing content...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appTitle}>Modern App</Text>
              <Text style={styles.headerSubtitle}>
                Experience the future of mobile design
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Content Section */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Quick Actions
            </Text>
            <View style={styles.actionButtons}>
              <Button
                title="Get Started"
                onPress={() => navigation.navigate('Detail')}
                style={styles.actionButton}
                icon={<Ionicons name="rocket-outline" size={20} color="white" />}
              />
              <Button
                title="Learn More"
                variant="outline"
                onPress={() => navigation.navigate('Profile')}
                style={styles.actionButton}
                icon={<Ionicons name="book-outline" size={20} color={colors.primary} />}
              />
            </View>
          </View>

          {/* Featured Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Features
            </Text>
            <FlatList
              data={featuredItems}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.featuredGrid}
            />
          </View>

          {/* Stats Section */}
          <Card style={[styles.statsCard, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.statsTitle, { color: themeColors.textPrimary }]}>
              App Statistics
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>99%</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Performance
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.secondary }]}>4.9</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Rating
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>10K+</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Users
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    height: 200,
    marginBottom: spacing.lg,
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  welcomeText: {
    ...typography.body,
    color: colors.background,
    opacity: 0.9,
  },
  appTitle: {
    ...typography.h1,
    color: colors.background,
    fontWeight: '800',
    marginVertical: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.background,
    opacity: 0.8,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  featuredGrid: {
    gap: spacing.md,
  },
  featuredItem: {
    flex: 1,
    margin: spacing.xs,
  },
  featureCard: {
    alignItems: 'center',
    padding: spacing.lg,
    minHeight: 140,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  featureSubtitle: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  statsCard: {
    padding: spacing.lg,
    ...shadows.medium,
  },
  statsTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;