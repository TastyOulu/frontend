import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const PasswordInput = ({ value, onChangeText, showPassword, toggleShowPassword,placeholder }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || t('ui_password')}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock" />}
        theme={{ roundness: 15 }}
        value={value}
        autoCapitalize="none"
        onChangeText={onChangeText}
      />
      <Ionicons
        name={showPassword ? 'eye-off' : 'eye'}
        size={24}
        color="grey"
        style={styles.icon}
        onPress={toggleShowPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: 10,
    position: 'relative',
  },
  input: {
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
});

export default PasswordInput;
