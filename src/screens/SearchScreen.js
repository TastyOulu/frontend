import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ScrollView, Linking } from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/Background';
import Constants from 'expo-constants';
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

  const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

  useEffect(() => {
    const getUserLocation = async () => {
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
          },
          (error) => setErrorMsg("Sijainnin haku epäonnistui."),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    };
    getUserLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else {
      return true;
    }
  };

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
      if (data.results) {
        setRestaurants(data.results);
        setErrorMsg(null);
      } else {
        setRestaurants([]);
        setErrorMsg("Ei ravintoloita löytynyt.");
      }
    } catch (error) {
      setErrorMsg("Ravintoloiden haku epäonnistui.");
      setRestaurants([]);
    }
  };

  const onPressSearch = () => {
    fetchRestaurants(searchQuery, '', region.latitude, region.longitude);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const placeType = newPlaceTypeMapping[category];
    fetchRestaurants(searchQuery, placeType, region.latitude, region.longitude);
  };

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Searchbar
            placeholder="Search for restaurant..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <View style={styles.chipContainer}>
            {Object.keys(newPlaceTypeMapping).map((category) => (
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

          <View style={styles.restaurantListContainer}>
            <ScrollView style={styles.restaurantListScroll} nestedScrollEnabled={true}>
              {restaurants.map((item) => (
                <Card key={item.place_id} style={styles.card}>
                  <Card.Content>
                    <View style={styles.titleContainer}>
                      <Title>{item.name}</Title>
                      <Button
                        style={styles.navigateButton}
                        onPress={() => openMap(item)}
                        icon={() => <Ionicons name="navigate-outline" size={20} color="#000" />}
                      />
                    </View>
                    <Paragraph>{item.vicinity || item.formatted_address}</Paragraph>
                    {item.rating && <Paragraph>Rating: {item.rating}</Paragraph>}
                  </Card.Content>
                </Card>
              ))}
              {restaurants.length === 0 && (
                <Text style={styles.listItemText}>{errorMsg || "Ei ravintoloita löytynyt."}</Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region}>
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
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingTop: 80, paddingBottom: 80 },
  container: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  searchbar: { marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 },
  chip: { margin: 4 },
  searchButton: { marginBottom: 16 },
  restaurantListContainer: { height: 300, marginBottom: 16 },
  restaurantListScroll: { flex: 1 },
  card: { marginVertical: 4 },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  navigateButton: { marginTop: 8 },
  mapContainer: { height: 300, marginTop: 16 },
  map: { width: '100%', height: '100%' },
  listItemText: { textAlign: 'center', marginVertical: 16 },
});

export default SearchScreen;
