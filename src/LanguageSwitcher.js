import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: '🇬🇧' },
  { code: 'fi', label: '🇫🇮' },
  { code: 'sv', label: '🇸🇪' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageChange(lang.code)}
          style={[
            styles.button,
            currentLanguage === lang.code && styles.selectedButton
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              currentLanguage === lang.code && styles.selectedText
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  selectedButton: {
    backgroundColor: '#9859FC',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
});

export default LanguageSwitcher;
