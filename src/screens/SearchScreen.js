import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/Background';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 65.0121,
    longitude: 25.4651,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

// Load API key from app.config.js
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  })();
}, []);

  const fetchRestaurants = async (query, category, lat, lng) => {
    let keyword = query.trim() || "restaurant";
    // If the keyword does not contain "restaurant", add it
    if (!keyword.toLowerCase().includes("restaurant")) {
      keyword = `${keyword} restaurant`;
    }
    // Fetch radius 5km
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat},${lng}&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;
        
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data);
      if (data.error_message) {
        setErrorMsg(data.error_message);
        setRestaurants([]);
      } else if (data.results) {
        setRestaurants(data.results);
        setErrorMsg(null);
      } else {
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setErrorMsg("Error fetching restaurants.");
      setRestaurants([]);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to show your position on the map.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Fetch restaurants only on button press
  const onPressSearch = () => {
    fetchRestaurants(searchQuery, selectedCategory, region.latitude, region.longitude);
  };

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    if (category === 'Your location') {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            fetchRestaurants(searchQuery, category, latitude, longitude);
          },
          (error) => {
            console.log("Error getting location:", error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } else {
      fetchRestaurants(searchQuery, category, region.latitude, region.longitude);
    }
  };

  return (
    <Background>
        <View style={styles.container}>
          {/* Top: SearchField, chips and search-button */}
          <Searchbar
            placeholder="Hae ravintolaa..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <View style={styles.chipContainer}>
            {['Fastfood', 'Pizza', 'Open', 'Sushi', 'Your location'].map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => handleCategoryPress(category)}
                style={styles.chip}
              >
                {category}
              </Chip>
            ))}
          </View>
          <Button mode="contained" onPress={onPressSearch} style={styles.searchButton}>
            Search
          </Button>

          {/* Middle: RestaurantsList ScrollView */}
          <View style={styles.restaurantListContainer}>
            <ScrollView contentContainerStyle={styles.listContainer}>
              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <Card key={restaurant.place_id} style={styles.card}>
                    <Card.Content>
                      <Title>{restaurant.name}</Title>
                      <Paragraph>{restaurant.formatted_address || restaurant.vicinity}</Paragraph>
                      {restaurant.rating && <Paragraph>Rating: {restaurant.rating}</Paragraph>}
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <Text style={styles.listItemText}>No restaurants found.</Text>
              )}
            </ScrollView>
          </View>

          {/* Bottom: Static map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              showsUserLocation={true}
            >
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.place_id}
                  coordinate={{
                    latitude: restaurant.geometry.location.lat,
                    longitude: restaurant.geometry.location.lng,
                  }}
                  title={restaurant.name}
                  description={restaurant.formatted_address || restaurant.vicinity}
                />
              ))}
            </MapView>
          </View>
        </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 80,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 100,
    paddingBottom: 80,
  },
  searchbar: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  searchButton: {
    marginBottom: 16,
  },
  restaurantListContainer: {
    height: 250, 
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 4,
  },
  listItemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default SearchScreen;
