import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const ads = [
  {
    id: '1',
    text: 'Promote your restaurant',
  },
  {
    id: '2',
    text: 'Get 50% off on your first order',
  },
  {
    id: '3',
    text: 'Free delivery on orders above $50',
  },
];

const AdCarousel = () => {
  return (
    <Carousel
      loop
      width={width} // <-- tämä on pakollinen!
      height={200}  // <-- määrittele myös korkeus
      autoPlay
      data={ads}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdCarousel;

