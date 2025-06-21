import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SettingsScreen = () => {
  const { colors: themeColors, isDarkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: false,
    analytics: true,
    autoUpdate: true,
  });

  const scaleAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    scaleAnimation.value = withSpring(0.98, {}, () => {
      scaleAnimation.value = withSpring(1);
    });
  };

  const showResetAlert = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              locationServices: false,
              analytics: true,
              autoUpdate: true,
            });
          }
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'General',
      items: [
        {
          key: 'darkMode',
          icon: isDarkMode ? 'moon' : 'sunny',
          label: 'Dark Mode',
          value: isDarkMode,
          onToggle: toggleTheme,
        },
        {
          key: 'notifications',
          icon: 'notifications',
          label: 'Push Notifications',
          value: settings.notifications,
          onToggle: (value) => handleSettingChange('notifications', value),
        },
        {
          key: 'autoUpdate',
          icon: 'refresh',
          label: 'Auto Update',
          value: settings.autoUpdate,
          onToggle: (value) => handleSettingChange('autoUpdate', value),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          key: 'locationServices',
          icon: 'location',
          label: 'Location Services',
          value: settings.locationServices,
          onToggle: (value) => handleSettingChange('locationServices', value),
        },
        {
          key: 'analytics',
          icon: 'analytics',
          label: 'Analytics & Crash Reports',
          value: settings.analytics,
          onToggle: (value) => handleSettingChange('analytics', value),
        },
      ],
    },
  ];

  const actionButtons = [
    {
      title: 'Export Data',
      icon: 'download-outline',
      variant: 'outline',
      onPress: () => Alert.alert('Export Data', 'Feature coming soon!'),
    },
    {
      title: 'Clear Cache',
      icon: 'trash-outline',
      variant: 'outline',
      onPress: () => Alert.alert('Clear Cache', 'Cache cleared successfully!'),
    },
    {
      title: 'Reset Settings',
      icon: 'refresh-outline',
      variant: 'outline',
      onPress: showResetAlert,
      textStyle: { color: colors.error },
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Customize your app experience
          </Text>
        </View>

        <Animated.View style={animatedStyle}>
          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                {section.title}
              </Text>
              <Card style={[styles.settingsCard, { backgroundColor: themeColors.surface }]}>
                {section.items.map((item, itemIndex) => (
                  <View
                    key={item.key}
                    style={[
                      styles.settingItem,
                      itemIndex < section.items.length - 1 && styles.settingItemBorder,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[
                        styles.settingIcon,
                        { backgroundColor: colors.primary + '20' }
                      ]}>
                        <Ionicons name={item.icon} size={20} color={colors.primary} />
                      </View>
                      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                        {item.label}
                      </Text>
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{
                        false: themeColors.border,
                        true: colors.primary + '40',
                      }}
                      thumbColor={item.value ? colors.primary : themeColors.textTertiary}
                      ios_backgroundColor={themeColors.border}
                    />
                  </View>
                ))}
              </Card>
            </View>
          ))}

          {/* App Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              App Information
            </Text>
            <Card style={[styles.infoCard, { backgroundColor: themeColors.surface }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Version
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                  1.0.0
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Build
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                  2024.01.15
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Platform
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                  React Native
                </Text>
              </View>
            </Card>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Actions
            </Text>
            <View style={styles.actionButtons}>
              {actionButtons.map((button, index) => (
                <Button
                  key={index}
                  title={button.title}
                  variant={button.variant}
                  onPress={button.onPress}
                  style={styles.actionButton}
                  textStyle={button.textStyle}
                  icon={<Ionicons name={button.icon} size={20} color={
                    button.textStyle?.color || colors.primary
                  } />}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },
  infoCard: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '600',
  },
  actionButtons: {
    gap: spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});

export default SettingsScreen;