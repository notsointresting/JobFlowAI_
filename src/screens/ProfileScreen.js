import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfileScreen = () => {
  const { colors: themeColors, isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Mobile app enthusiast and UI/UX designer passionate about creating beautiful user experiences.',
  });

  const editAnimation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + editAnimation.value * 0.02) }],
  }));

  const handleEdit = () => {
    setIsEditing(!isEditing);
    editAnimation.value = withSpring(isEditing ? 0 : 1);
  };

  const handleSave = () => {
    setIsEditing(false);
    editAnimation.value = withSpring(0);
    // Here you would typically save to backend
  };

  const profileSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: handleEdit },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
        { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: isDarkMode ? 'moon' : 'sunny-outline', 
          label: `${isDarkMode ? 'Dark' : 'Light'} Mode`, 
          onPress: toggleTheme,
          hasSwitch: true,
        },
        { icon: 'language-outline', label: 'Language', onPress: () => {} },
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
      ],
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
          <LinearGradient
            colors={[colors.secondary, colors.secondaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[colors.accent, colors.accentDark]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
              </View>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Profile Content */}
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Bio Section */}
          <Card style={[styles.bioCard, { backgroundColor: themeColors.surface }]}>
            <View style={styles.bioHeader}>
              <Text style={[styles.bioTitle, { color: themeColors.textPrimary }]}>
                About
              </Text>
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons
                  name={isEditing ? 'checkmark' : 'pencil'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            
            {isEditing ? (
              <Input
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                multiline
                placeholder="Tell us about yourself..."
                style={styles.bioInput}
              />
            ) : (
              <Text style={[styles.bioText, { color: themeColors.textSecondary }]}>
                {profile.bio}
              </Text>
            )}
            
            {isEditing && (
              <View style={styles.bioActions}>
                <Button
                  title="Save"
                  onPress={handleSave}
                  size="small"
                  style={styles.saveButton}
                />
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setIsEditing(false)}
                  size="small"
                  style={styles.cancelButton}
                />
              </View>
            )}
          </Card>

          {/* Settings Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                {section.title}
              </Text>
              <Card style={[styles.settingsCard, { backgroundColor: themeColors.surface }]}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex < section.items.length - 1 && styles.settingItemBorder,
                      { borderBottomColor: themeColors.border },
                    ]}
                    onPress={item.onPress}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Ionicons name={item.icon} size={20} color={colors.primary} />
                      </View>
                      <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                        {item.label}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={themeColors.textTertiary}
                    />
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}

          {/* Logout Button */}
          <Button
            title="Sign Out"
            variant="outline"
            onPress={() => {}}
            style={[styles.logoutButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
            icon={<Ionicons name="log-out-outline" size={20} color={colors.error} />}
          />
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
    height: 220,
    marginBottom: spacing.lg,
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  profileHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  avatarText: {
    ...typography.h2,
    color: colors.background,
    fontWeight: '700',
  },
  profileName: {
    ...typography.h2,
    color: colors.background,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
    color: colors.background,
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  bioCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bioTitle: {
    ...typography.h3,
  },
  bioText: {
    ...typography.body,
    lineHeight: 22,
  },
  bioInput: {
    marginBottom: 0,
  },
  bioActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
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
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
});

export default ProfileScreen;