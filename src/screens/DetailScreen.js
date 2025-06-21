import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

const DetailScreen = ({ navigation, route }) => {
  const { colors: themeColors } = useTheme();
  const { item } = route.params || {};
  
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [1, 0.5, 0]
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2]
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const backButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1]
    );

    return {
      backgroundColor: `rgba(255, 255, 255, ${backgroundColor})`,
    };
  });

  const features = [
    {
      icon: 'rocket-outline',
      title: 'High Performance',
      description: 'Optimized for speed and efficiency with smooth animations.',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Secure',
      description: 'Built with security best practices and data protection.',
    },
    {
      icon: 'people-outline',
      title: 'User Friendly',
      description: 'Intuitive design that puts user experience first.',
    },
    {
      icon: 'refresh-outline',
      title: 'Regular Updates',
      description: 'Continuous improvements and new features.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={item?.icon || 'star'} 
                size={60} 
                color={colors.background} 
              />
            </View>
            <Text style={styles.headerTitle}>
              {item?.title || 'Feature Details'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {item?.subtitle || 'Discover amazing capabilities'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Back Button */}
      <SafeAreaView style={styles.backButtonContainer}>
        <Animated.View style={[styles.backButton, backButtonStyle]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonTouch}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: HEADER_HEIGHT }} />
        
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Description Card */}
          <Card style={[styles.descriptionCard, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.descriptionTitle, { color: themeColors.textPrimary }]}>
              About This Feature
            </Text>
            <Text style={[styles.descriptionText, { color: themeColors.textSecondary }]}>
              This feature represents the cutting-edge of mobile app development, 
              combining beautiful design with powerful functionality. Built with 
              React Native and modern development practices, it delivers an 
              exceptional user experience across all devices.
            </Text>
          </Card>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Key Features
            </Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  style={[
                    styles.featureCard,
                    { backgroundColor: themeColors.surface },
                    index % 2 === 0 ? styles.featureCardLeft : styles.featureCardRight,
                  ]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name={feature.icon} size={24} color={colors.primary} />
                  </View>
                  <Text style={[styles.featureTitle, { color: themeColors.textPrimary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: themeColors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </View>
          </View>

          {/* Stats Section */}
          <Card style={[styles.statsCard, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.statsTitle, { color: themeColors.textPrimary }]}>
              Performance Metrics
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  99.9%
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Uptime
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.secondary }]}>
                  &lt;100ms
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  Response Time
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>
                  5★
                </Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                  User Rating
                </Text>
              </View>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button
              title="Get Started"
              onPress={() => {}}
              style={styles.primaryButton}
              icon={<Ionicons name="rocket" size={20} color="white" />}
            />
            <Button
              title="Learn More"
              variant="outline"
              onPress={() => {}}
              style={styles.secondaryButton}
              icon={<Ionicons name="book-outline" size={20} color={colors.primary} />}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1,
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
    paddingTop: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.background,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.background,
    opacity: 0.9,
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  backButton: {
    margin: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    ...shadows.medium,
  },
  backButtonTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  descriptionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  descriptionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  descriptionText: {
    ...typography.body,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  featureCard: {
    width: (width - spacing.lg * 2 - spacing.xs * 2) / 2,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  featureCardLeft: {
    marginRight: spacing.xs,
  },
  featureCardRight: {
    marginLeft: spacing.xs,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  featureDescription: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: 18,
  },
  statsCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionSection: {
    gap: spacing.md,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    marginBottom: spacing.lg,
  },
});

export default DetailScreen;