import React, { useCallback } from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

import GradientBackground from '../components/GradientBackground';
import AdCarousel from '../components/AdCarousel';
import Top5Carousel from '../components/top5Carousel';
import AIBot from '../components/AIBot';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(colorScheme === 'dark' ? 'light' : 'dark', true);
    }, [colorScheme])
  );

  return (
    <GradientBackground statusBarStyle={colorScheme === 'dark' ? 'light' : 'dark'}>
      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
        <View style={styles.inner}>
          <Pressable onPress={() => navigation.navigate('Info')}>
            <Text style={styles.text}>
              {t('ui_review_and_earn')}{' '}
              <Text style={styles.linkText}>
                {t('ui_here')}
              </Text>
            </Text>
          </Pressable>

          <Text style={styles.heading}>{t('ui_best_offers')}</Text>
          <AdCarousel />

          <Text style={styles.heading}>{t('ui_top_5')}</Text>
          <Top5Carousel />
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <AIBot />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  inner: {
    alignItems: 'center',
    paddingHorizontal: 20, // ✅ estää tekstin katkeamisen
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  linkText: {
    color: 'purple',
    textDecorationLine: 'underline',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
