import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path
import { SPACING, FONTS, SIZES, COLORS } from '../constants/theme';
import CustomButton from '../components/CustomButton'; // Adjust path
import ModernTextInput from '../components/ModernTextInput'; // Adjust path
import AnimatedLoadingIndicator from '../components/AnimatedLoadingIndicator'; // Adjust path
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [textInputValue, setTextInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleNavigateToSettings = () => {
    const timestamp = new Date().toLocaleTimeString();
    navigation.navigate('Settings', { source: 'HomeScreen', time: timestamp });
  };

  const handleNavigateToGrid = () => {
    navigation.navigate('GridDemo');
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    setFormErrors({});
    let errors = {};
    if (!emailValue) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(emailValue)) errors.email = "Email is invalid.";
    if (!passwordValue) errors.password = "Password is required.";
    else if (passwordValue.length < 6) errors.password = "Password must be at least 6 characters.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', { emailValue, passwordValue });
      setIsLoading(false);
      // Clear form or show success message
      setEmailValue('');
      setPasswordValue('');
      setTextInputValue(''); // Also clear the name input
      setFormErrors({});
      navigation.navigate('Settings', {
        source: 'FormSubmission',
        message: 'Successfully submitted!',
        userEmail: emailValue
      });
    }, 2000);
  };

  if (isLoading && !Object.keys(formErrors).length) { // Show full screen loader only if not error loading
      return <AnimatedLoadingIndicator />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Component Showcase</Text>
        <Text style={styles.subtitle}>Testing new UI elements.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buttons & Navigation</Text>
          <CustomButton
            title="Go to Settings"
            onPress={handleNavigateToSettings}
            style={{ marginBottom: SPACING.s }}
            leftIcon={<Ionicons name="cog-outline" size={SIZES.h3} color={theme.COLORS.white} style={{marginRight: SPACING.xs}}/>}
          />
          <CustomButton
            title="View Grid Demo"
            onPress={handleNavigateToGrid}
            variant="secondary" // Use secondary for this example
            style={{ marginBottom: SPACING.s }}
            leftIcon={<Ionicons name="grid-outline" size={SIZES.h3} color={theme.COLORS.white} style={{marginRight: SPACING.xs}}/>}
          />
          <CustomButton
            title="Secondary Action"
            onPress={() => console.log('Secondary button pressed')}
            variant="secondary"
            style={{ marginBottom: SPACING.s }}
          />
          <CustomButton
            title="Outline Button"
            onPress={() => console.log('Outline button pressed')}
            variant="outline"
            style={{ marginBottom: SPACING.s }}
            rightIcon={<Ionicons name="arrow-forward-circle-outline" size={SIZES.h3} color={theme.isDarkMode ? theme.COLORS.white : theme.COLORS.primary} style={{marginLeft: SPACING.xs}}/>}
          />
           <CustomButton
            title="Ghost Button"
            onPress={() => console.log('Ghost button pressed')}
            variant="ghost"
            style={{ marginBottom: SPACING.s }}
          />
          <CustomButton
            title="Disabled Button"
            onPress={() => console.log('Disabled button pressed')}
            disabled
            style={{ marginBottom: SPACING.s }}
          />
          <CustomButton
            title="Loading Button"
            isLoading
            style={{ marginBottom: SPACING.s }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Inputs</Text>
          <ModernTextInput
            label="Your Name"
            placeholder="Enter your full name"
            value={textInputValue}
            onChangeText={setTextInputValue}
            leftIcon={<Ionicons name="person-circle-outline" size={SIZES.h3} color={theme.colors.textGray}/>}
          />
          <ModernTextInput
            label="Email Address"
            placeholder="you@example.com"
            value={emailValue}
            onChangeText={setEmailValue}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
            touched={!!formErrors.email} // Consider touched state from a form library in real app
          />
          <ModernTextInput
            label="Password"
            placeholder="Enter your password"
            value={passwordValue}
            onChangeText={setPasswordValue}
            isPassword // This enables secureTextEntry and visibility toggle
            error={formErrors.password}
            touched={!!formErrors.password}
          />
          <CustomButton
            title={isLoading ? "Submitting..." : "Submit Form"}
            onPress={handleFormSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
            style={{marginTop: SPACING.s}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading Indicator (Inline)</Text>
          <AnimatedLoadingIndicator size="small" style={{height: 50}}/>
        </View>

      </View>
    </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove to allow scrolling from top
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: SPACING.m,
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
  section: {
    width: '100%',
    marginBottom: SPACING.l,
    padding: SPACING.m,
    backgroundColor: theme.colors.card,
    borderRadius: SIZES.radius,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1, // Subtle elevation for sections
  },
  sectionTitle: {
    ...FONTS.h3,
    color: theme.colors.text,
    marginBottom: SPACING.m,
  }
});

export default HomeScreen;
