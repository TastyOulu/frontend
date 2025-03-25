import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Linking } from 'react-native';
import { Searchbar, Chip, Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Background from '../components/Background';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { getDistance } from 'geolib';

const SearchScreen = () => {
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
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);
  const API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

  const categories = {
    Fastfood: 'fast_food',
    Pizza: 'pizza',
    Sushi: 'sushi',
    Cafe: 'cafe',
    Bakery: 'bakery',
    Bar: 'bar',
    Steakhouse: 'steakhouse',
    Asian: 'asian_restaurant',
    Indian: 'indian_restaurant',
    'Your location': null,
  };

  useEffect(() => {
    handleCategoryPress('Your location');
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchRestaurants(searchQuery, '', region.latitude, region.longitude);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchRestaurants = async (query, type, lat, lng) => {
    const latitude = lat || region.latitude;
    const longitude = lng || region.longitude;
    setIsLoading(true);
  
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&key=${API_KEY}`;
    url += type ? `&keyword=${type}` : `&keyword=${encodeURIComponent(query.trim() || 'restaurant')}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        const filtered = data.results.filter(item =>
          item.types?.some(t =>
            ['restaurant', 'bar', 'cafe'].includes(t)
          )
        );
  
        const withDistance = filtered.map(item => ({
          ...item,
          distance: getDistance(
            { latitude, longitude },
            { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }
          ),
        }));
        setRestaurants(withDistance);
        setErrorMsg(null);
      } else {
        setRestaurants([]);
        setErrorMsg("No restaurants found.");
      }
    } catch {
      setErrorMsg("Failed to fetch restaurants.");
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryPress = async (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
      setSearchQuery('');
      setRestaurants([]);
      return;
    }

    setSelectedCategory(category);
    const type = categories[category];

    if (category === 'Your location') {
      setSearchQuery('');
      try {
        setIsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Location permission not granted.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const newRegion = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        let all = [], token = null, count = 0;

        do {
          let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=restaurant&key=${API_KEY}`;
          if (token) {
            url += `&pagetoken=${token}`;
            await new Promise(res => setTimeout(res, 2000));
          }

          const res = await fetch(url);
          const data = await res.json();
          if (data.results) all = [...all, ...data.results];
          token = data.next_page_token;
          count++;
        } while (token && count < 2);

        const filtered = all.filter(item =>
          item.types?.some(t =>
            ['restaurant', 'bar', 'cafe'].includes(t)
          )
        );
        
        const enriched = all.map(item => ({
          ...item,
          distance: getDistance(
            { latitude, longitude },
            { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }
          ),
        }));

        setRestaurants(enriched.sort((a, b) => a.distance - b.distance));
      } catch {
        setErrorMsg("Failed to fetch nearby restaurants.");
      } finally {
        setIsLoading(false);
      }
    } else {
      fetchRestaurants(searchQuery, type, region.latitude, region.longitude);
    }
  };

  const openMap = (restaurant) => {
    const { lat, lng } = restaurant.geometry.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${restaurant.name}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${restaurant.name})`,
    });
    Linking.openURL(url);
  };

  const centerMapOnRestaurant = (restaurant) => {
    const { lat, lng } = restaurant.geometry.location;
    const focusRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    mapRef.current?.animateToRegion(focusRegion, 1000);
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Searchbar
            placeholder="Search restaurants..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <View style={styles.chipContainer}>
            {Object.keys(categories).map(cat => (
              <Chip
                key={cat}
                selected={selectedCategory === cat}
                onPress={() => handleCategoryPress(cat)}
                style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                textStyle={selectedCategory === cat && styles.chipTextSelected}
              >
                {cat}
              </Chip>
            ))}
          </View>
          <Button mode="contained" onPress={() => fetchRestaurants(searchQuery, '', region.latitude, region.longitude)} style={styles.searchButton}>
            Search
          </Button>

          <View style={styles.restaurantListContainer}>
            <ScrollView style={styles.restaurantListScroll} nestedScrollEnabled>
              {isLoading ? (
                <Text style={styles.listItemText}>Loading restaurants...</Text>
              ) : restaurants.length === 0 ? (
                <Text style={styles.listItemText}>{errorMsg || "No restaurants found."}</Text>
              ) : (
                restaurants.map(item => (
                  <Card key={item.place_id} style={styles.card} onPress={() => centerMapOnRestaurant(item)}>
                    <Card.Content>
                      <View style={styles.titleContainer}>
                        <Title>{item.name}</Title>
                        <Button
                          style={styles.navigateButton}
                          onPress={() => openMap(item)}
                          icon={() => <Ionicons name="navigate-outline" size={20} color="#000" />}
                        />
                      </View>
                      <Paragraph>
                        {item.vicinity || item.formatted_address}
                        {item.distance !== undefined && ` • ${(item.distance / 1000).toFixed(1)} km`}
                      </Paragraph>
                      {item.rating && <Paragraph>Rating: {item.rating}</Paragraph>}
                    </Card.Content>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>

          <View style={styles.mapContainer}>
            <MapView ref={mapRef} style={styles.map} region={region}>
              {restaurants.map(r => (
                <Marker
                  key={r.place_id}
                  coordinate={{ latitude: r.geometry.location.lat, longitude: r.geometry.location.lng }}
                  title={r.name}
                  description={r.vicinity || r.formatted_address}
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
  chip: { margin: 4, borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#f0f0f0' },
  chipSelected: { backgroundColor: '#6200ee' },
  chipTextSelected: { color: 'white', fontWeight: 'bold' },
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
