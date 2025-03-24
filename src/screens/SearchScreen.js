import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, PermissionsAndroid, Platform, Linking } from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/Background';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

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


  // New Place Types mapping
  const newPlaceTypeMapping = {
    'Fastfood': 'fast_food_restaurant',
    'Pizza': 'pizza_restaurant',
    'Sushi': 'sushi_restaurant',
    'Cafe': 'coffee_shop',
    'Bakery': 'bakery',
    'Fine Dining': 'fine_dining_restaurant',
    'Bar': 'bar',
    'Vegetarian': 'vegetarian_restaurant',
    'Steakhouse': 'steak_house',
    'Your location': '',
  };

  const fetchRestaurants = async (query, placeType, lat, lng) => {
    const locationLat = lat || region.latitude;
    const locationLng = lng || region.longitude;

    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationLat},${locationLng}&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;

    if (placeType) {
      url += `&keyword=${placeType}`;
    } else {
      const keyword = query.trim() || "restaurant";
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      //console.log("API Response:", data);
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
      setErrorMsg("Ravintoloiden haku epäonnistui.");
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
    fetchRestaurants(searchQuery, '', region.latitude, region.longitude);
  };

  const handleCategoryPress = async (category) => {
    setSelectedCategory(category);
    const placeType = newPlaceTypeMapping[category];

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
            fetchRestaurants(searchQuery, '', latitude, longitude);
          },
          (error) => {
            console.log("Error getting location:", error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } else {
      fetchRestaurants(searchQuery, placeType, region.latitude, region.longitude);
    }
  };
  
  // Open map when user presses "Navigate" button on a restaurant card
  const openMap = (restaurant) => {
    const { lat, lng } = restaurant.geometry.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${restaurant.name}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${restaurant.name})`
    });
    Linking.openURL(url);
  };

  return (
    <Background>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Searchbar
              placeholder="Search for restaurant..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
            <View style={styles.chipContainer}>
  {['Fastfood', 'Pizza', 'Sushi', 'Cafe', 'Bakery', 'Fine Dining', 'Bar', 'Vegetarian', 'Steakhouse', 'Your location'].map((category) => (
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
          </View>
          <Button mode="contained" onPress={onPressSearch} style={styles.searchButton}>
            Search
          </Button>

          {/* Middle: RestaurantsList ScrollView */}
          <View style={styles.restaurantListContainer}>
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Content>
                    <Title>{item.name}</Title>
                    <Paragraph>{item.vicinity || item.formatted_address}</Paragraph>
                    {item.rating && <Paragraph>Rating: {item.rating}</Paragraph>}
                  </Card.Content>
                </Card>
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
                  description={restaurant.vicinity || restaurant.formatted_address}
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
  navigateButton: {
    marginTop: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
export default SearchScreen;
