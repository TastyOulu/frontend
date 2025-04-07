import React from 'react';
import { View, Dimensions, StyleSheet, Text,Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const ads = [
    { text: 'Ravintola 1' },
    { text: 'Ravintola 2' },
    { text: 'Ravintola 3' },
    { text: 'Ravintola 4' },
    { text: 'Ravintola 5' },
];

const AdCarousel = () => {
  return (
    <Carousel
      loop
      width={width}
      height={200}
      //autoPlay 
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
      style={{ marginBottom: 100 }} 
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 50,
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

