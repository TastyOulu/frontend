import React from 'react';
import { View, Dimensions, StyleSheet, Text,Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const ads = [
  {
    id: '1',
    image: require('../../assets/lemon.png'),
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
        <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <View style={styles.card}>
                {item.image ? (
                    <Image source={item.image} style={styles.image} resizeMode="cover" />
                ) : (
                    <Text style={styles.text}>{item.text}</Text>
                )}
            </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 50,
    //margin:20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20,
    
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
   
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AdCarousel;

