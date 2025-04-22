import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Constants from 'expo-constants';
import axios from 'axios';

const { height, width } = Dimensions.get('window');
const API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

const CafeCarousel = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=kahvila+Oulu&key=${API_KEY}`
        );
        const data = response.data;
        const top5 = data.results.slice(0, 5).map((place) => ({
          name: place.name,
          address: place.formatted_address,
          image: place.photos
            ? {
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`,
              }
            : null,
        }));
        setAds(top5);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  const NoImageIcon = () => (
    <View style={styles.noImageIconContainer}>
      <Text style={styles.noImageIconText}>No Image</Text>
    </View>
  );

  return (
    <Carousel
      loop
      width={width}
      height={220}
      data={ads}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <View style={styles.card}>
            {item.image ? (
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            ) : (
              <NoImageIcon />
            )}
            <View style={styles.overlay}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
          </View>
        </View>
      )}
      style={{ marginBottom: 100 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 60,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    color: 'white',
    fontSize: 14,
  },
  loader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageIconContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageIconText: {
    fontSize: 20,
    color: '#888',
  },
});

export default CafeCarousel;