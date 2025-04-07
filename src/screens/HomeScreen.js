import React from 'react';
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import GradientBackground from '../components/GradientBackground';
import AdCarousel from '../components/AdCarousel';
import Top5Carousel from '../components/top5Carousel';
import AIBot from '../components/AIBot';

const Component = require('../../assets/Component 3.png');

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <GradientBackground>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={Component} style={{ width: 305, height: 159, resizeMode: 'contain', marginTop: 20 }} />
            <Text style={{ fontSize: 18, fontStyle: 'italic', padding: 10 }}>{t('ui_slogan')}</Text>
          </View>

          <View style={{ marginTop: 40 }}>
            <Pressable onPress={() => navigation.navigate('Info')}>
              <Text style={{ fontSize: 18 }}>
                {t('ui_review_and_earn')} <Text style={{ color: 'purple', textDecorationLine: 'underline' }}>{t('ui_here')}</Text>
              </Text>
            </Pressable>
          </View>

          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
              {t('ui_best_offers')}
            </Text>
            <AdCarousel />
          </View>

          <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
            {t('ui_top_5')}
            </Text>
            <Top5Carousel />
          </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
