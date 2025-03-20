import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/Background';
import Constants from 'expo-constants';

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

  // Ladataan API-avain Expo Constantsista (määritelty app.config.js:n extra-kentässä)
  const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

  const fetchRestaurants = async (query, category, lat, lng) => {
    let keyword = query.trim() || "restaurant";
    // Jos hakutermi ei sisällä sanaa "restaurant", lisätään se
    if (!keyword.toLowerCase().includes("restaurant")) {
      keyword = `${keyword} restaurant`;
    }
    // Haetaan Oulun alueelta 5000 metrin säteellä
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=65.0121,25.4651&radius=5000&key=${GOOGLE_PLACES_API_KEY}`;
    
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

  // Haetaan uudet ravintolat vasta kun "Hae" -nappia painetaan
  const onPressSearch = () => {
    fetchRestaurants(searchQuery, selectedCategory);
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
      fetchRestaurants(searchQuery, category);
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Yläosa: Hakukenttä, kategoriat ja haku-nappi */}
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
            Hae
          </Button>

          {/* Keskiosa: Ravintolalistaus, oma scrollview, jotta vain lista scrollataan */}
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
                <Text style={styles.listItemText}>Ei ravintoloita löytynyt.</Text>
              )}
            </ScrollView>
          </View>

          {/* Alaosa: Kartta, joka pysyy kiinteänä */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
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
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 80,   // Tilaa yläbarille
    paddingBottom: 80, // Tilaa ala-barille
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
    height: 250, // Kiinteä korkeus ravintolalistan alueelle, jossa lista scrollataan
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
