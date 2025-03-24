import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Background from '../components/Background';
import Constants from 'expo-constants';

const ReviewScreen = () => {
  const [restaurant, setRestaurant] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [fetchedRestaurants, setFetchedRestaurants] = useState([]);

  const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

  const handleStarPress = (index) => {
    setRating(index + 1);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitReview = () => {
    if (restaurant && review && rating) {
      const newReview = {
        id: Math.random().toString(),
        restaurant,
        review,
        rating,
        image,
        username: 'Anonymous',
        date: new Date().toLocaleString(),
        upVotes: 0,
        downVotes: 0,
        userVote: null,
      };
      setReviews([newReview, ...reviews]);
      setRestaurant('');
      setReview('');
      setRating(0);
      setImage(null);
    }
  };

  const openReview = (reviewItem) => {
    setSelectedReview(reviewItem);
    setModalVisible(true);
  };

  const handleThumbUpPress = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => {
        if (r.id === reviewId) {
          if (r.userVote === 'up') return r;
          else if (r.userVote === 'down') {
            return {
              ...r,
              downVotes: r.downVotes - 1,
              upVotes: r.upVotes + 1,
              userVote: 'up',
            };
          } else {
            return {
              ...r,
              upVotes: r.upVotes + 1,
              userVote: 'up',
            };
          }
        }
        return r;
      })
    );
  };

  const handleThumbDownPress = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => {
        if (r.id === reviewId) {
          if (r.userVote === 'down') return r;
          else if (r.userVote === 'up') {
            return {
              ...r,
              upVotes: r.upVotes - 1,
              downVotes: r.downVotes + 1,
              userVote: 'down',
            };
          } else {
            return {
              ...r,
              downVotes: r.downVotes + 1,
              userVote: 'down',
            };
          }
        }
        return r;
      })
    );
  };

  useEffect(() => {
    if (restaurant) {
      fetchRestaurants(restaurant);
    } else {
      setFetchedRestaurants([]);
    }
  }, [restaurant]);

  useEffect(() => {
    if (selectedReview) {
      const updated = reviews.find((r) => r.id === selectedReview.id);
      if (updated) setSelectedReview(updated);
    }
  }, [reviews]);

  const fetchRestaurants = async (query) => {
    let keyword = query.trim();
    if (!keyword) return;

    keyword = `${keyword} in Oulu`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      keyword
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error_message) {
        console.error(data.error_message);
        setFetchedRestaurants([]);
      } else if (data.results) {
        const filteredResults = data.results.filter((item) => {
          const placeTypes = item.types || [];
          return placeTypes.includes('restaurant') || placeTypes.includes('cafe');
        });
        setFetchedRestaurants(filteredResults);
      } else {
        setFetchedRestaurants([]);
      }
    } catch (error) {
      console.error('Virhe ravintoloiden haussa:', error);
      setFetchedRestaurants([]);
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Submit your review</Text>

            <View style={styles.searchSection}>
              <TextInput
                value={restaurant}
                onChangeText={setRestaurant}
                placeholder="Restaurant name"
                style={styles.searchInput}
              />
              {fetchedRestaurants.length > 0 && (
                <View style={styles.listContainer}>
                  <FlatList
                    data={fetchedRestaurants.slice(0, 10)}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setRestaurant(item.name);
                          setFetchedRestaurants([]);
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listTitle}>{item.name}</Text>
                          <Text style={styles.listAddress}>{item.formatted_address}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Description"
              multiline
              style={styles.input}
            />

            <View style={styles.starContainer}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                  <Text style={index < rating ? styles.filledStar : styles.star}>
                    {index < rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Text style={styles.buttonText}>Load image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.previewImage} />}

            <TouchableOpacity onPress={submitReview} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>

            <View style={styles.reviewsContainer}>
              <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                extraData={reviews}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                      {/* Peukut ylös/alas - toimivat itsenäisesti */}
                      <View style={styles.thumbContainer}>
                        <TouchableOpacity
                          style={styles.thumbButtonLarge}
                          onPress={() => handleThumbUpPress(item.id)}
                        >
                          <Ionicons
                            name="thumbs-up"
                            size={26}
                            color={item.userVote === 'up' ? '#6200EA' : '#888'}
                          />
                          <Text style={styles.thumbCount}>{item.upVotes}</Text>
                        </TouchableOpacity>
                  
                        <TouchableOpacity
                          style={styles.thumbButtonLarge}
                          onPress={() => handleThumbDownPress(item.id)}
                        >
                          <Ionicons
                            name="thumbs-down"
                            size={26}
                            color={item.userVote === 'down' ? '#6200EA' : '#888'}
                          />
                          <Text style={styles.thumbCount}>{item.downVotes}</Text>
                        </TouchableOpacity>
                      </View>
                  
                      {/* Klikattava teksti- ja kuvaosa erikseen */}
                      <TouchableOpacity
                        onPress={() => openReview(item)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.reviewCardTop}>
                          {item.image && (
                            <Image source={{ uri: item.image }} style={styles.reviewImage} />
                          )}
                          <View style={styles.reviewTextContainer}>
                            <Text style={styles.reviewTitle}>{item.restaurant}</Text>
                            <Text style={styles.reviewDescription} numberOfLines={2}>
                              {item.review}
                            </Text>
                            <Text style={styles.reviewRating}>{'⭐'.repeat(item.rating)}</Text>
                          </View>
                        </View>
                        <Text style={styles.reviewDate}>{item.date}</Text>
                      </TouchableOpacity>
                    </View>
                  )}                  
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal (popup) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedReview && (
              <>
                <Text style={styles.modalTitle}>{selectedReview.restaurant}</Text>
                {selectedReview.image && (
                  <Image source={{ uri: selectedReview.image }} style={styles.modalImage} />
                )}
                <Text style={styles.modalText}>{selectedReview.review}</Text>
                <Text style={styles.modalRating}>{'⭐'.repeat(selectedReview.rating)}</Text>
                <Text style={styles.reviewDate}>{selectedReview.date}</Text>

                <View style={styles.modalThumbContainer}>
                  <TouchableOpacity
                    style={styles.thumbButtonLarge}
                    onPress={() => handleThumbUpPress(selectedReview.id)}
                  >
                    <Ionicons
                      name="thumbs-up"
                      size={28}
                      color={selectedReview.userVote === 'up' ? '#6200EA' : '#888'}
                    />
                    <Text style={styles.thumbCount}>{selectedReview.upVotes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.thumbButtonLarge}
                    onPress={() => handleThumbDownPress(selectedReview.id)}
                  >
                    <Ionicons
                      name="thumbs-down"
                      size={28}
                      color={selectedReview.userVote === 'down' ? '#6200EA' : '#888'}
                    />
                    <Text style={styles.thumbCount}>{selectedReview.downVotes}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Background>
  );
};

const styles = StyleSheet.create({
  /* Kokonaiscontainer */
  container: {
    flex: 1,
    width: '100%',
  },
  /* ScrollView:in sisältö */
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  /* Kääritään varsinainen sisältö */
  contentWrapper: {
    width: '90%',
    marginTop: 80, // Jotta yläbar ei peitä sisältöä
  },
  /* Otsikko */
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  /* Ravintolan haku + hakutulokset */
  searchSection: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    // Varjostus iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Varjostus Android
    elevation: 2,
  },
  listContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  listAddress: {
    fontSize: 14,
    color: '#777',
  },
  /* Arvostelun kuvaus */
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    minHeight: 60,
    // Varjostus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  /* Tähtiarvio */
  starContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },
  star: {
    fontSize: 32,
    color: '#ccc',
    marginHorizontal: 3,
  },
  filledStar: {
    fontSize: 32,
    color: '#FFD700',
    marginHorizontal: 3,
  },
  /* Nappien yleinen tyyli */
  imageButton: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    // Varjostus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  /* Kuvan esikatselu */
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },
  /* Submit-nappi */
  submitButton: {
    backgroundColor: '#6200EA',
    padding: 14,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 20,
    // Varjostus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  /* Arvostelulistan kontti */
  reviewsContainer: {
    width: '100%',
    height: 350, // Näytetään useampi arvostelu kerrallaan
    marginBottom: 30,
  },
  /* Yksittäinen arvostelukortti */
  reviewCard: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 6,
    borderRadius: 12,
    // Varjostus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative', // jotta peukkujen absolute-position toimii
  },
  thumbButtonLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Suurempi painopinta
    marginLeft: 10,
  },
  modalThumbContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  /* Peukut ylös/alas -kontti oikeassa yläkulmassa */
  thumbContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  thumbButton: {
    alignItems: 'center',
    marginLeft: 10,
  },
  thumbCount: {
    fontSize: 12,
    color: '#333',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  reviewDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  reviewRating: {
    marginTop: 4,
    fontSize: 14,
    color: '#FFD700',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  /* Modaalin tyylit */
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#444',
  },
  modalRating: {
    fontSize: 18,
    color: '#FFD700',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6200EA',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ReviewScreen;
