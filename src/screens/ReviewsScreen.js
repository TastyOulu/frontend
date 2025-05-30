import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
  StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import GradientBackground from '../components/GradientBackground';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

const ReviewScreen = () => {
  const { t } = useTranslation();
  const [restaurant, setRestaurant] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [fetchedRestaurants, setFetchedRestaurants] = useState([]);
  const [username, setUsername] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [userId, setUserId] = useState(null);

  const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;
  const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) throw new Error('No token');
        const { data } = await axios.get(`${REACT_APP_API_URL}/user/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(data?.username || 'Anonymous');
        setUserId(data?.userId || null );
      } catch {
        setUsername('Anonymous');
        setUserId(null);
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
  
        const response = await axios.get(`${REACT_APP_API_URL}/reviews`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          validateStatus: status => status < 500,
        });
  
        if (response.status === 404) {
          setReviews([]);
          return;
        }
  
        const reviewsData = Array.isArray(response.data) ? response.data : [];
  
        const restaurantNameCache = new Map();
        const usernameCache = new Map();
  
        const enrichedReviews = await Promise.all(
          reviewsData.map(async r => {
            let restaurantName = `Restaurant ID ${r.restaurantId}`;
  
            if (restaurantNameCache.has(r.restaurantId)) {
              restaurantName = restaurantNameCache.get(r.restaurantId);
            } else {
              try {
                const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${r.restaurantId}&fields=name&key=${GOOGLE_PLACES_API_KEY}`;
                const res = await fetch(detailsUrl);
                const data = await res.json();
  
                if (data?.result?.name) {
                  restaurantName = data.result.name;
                  restaurantNameCache.set(r.restaurantId, restaurantName);
                }
              } catch (err) {
                console.warn('Google Places API error:', err);
              }
            }
  
            let username = `User ${r.userId || 'Unknown'}`;
            let avatar = null;
            if (usernameCache.has(r.userId)) {
              const cached = usernameCache.get(r.userId);
              username = cached.username;
              avatar = cached.avatar;
            } else {
              try {
                const userToken = await SecureStore.getItemAsync('userToken');
                const userRes = await axios.get(`${REACT_APP_API_URL}/user/user/${r.userId}`, {
                  headers: { Authorization: `Bearer ${userToken}` },
                });
                if (userRes.data?.username) {
                  username = userRes.data.username;
                  avatar = userRes.data.avatar;
                  usernameCache.set(r.userId, { username, avatar });
                }
              } catch (err) {
                console.warn('Error fetching user data:', err);
              }
            }
  
            const reviewDate = new Date(r.createdAt).toLocaleDateString();
  
            return {
              id: r.reviewId?.toString() || Math.random().toString(),
              restaurant: restaurantName,
              review: r.review,
              rating: r.grade || 0,
              image: null,
              username: username,
              avatar: avatar,
              restaurantId: r.restaurantId,
              userId: r.userId,
              date: reviewDate,
              createdAt: r.createdAt,
              upVotes: Array.isArray(r.likes) ? r.likes.length : 0,
              downVotes: 0,
              userVote: Array.isArray(r.likes) && r.likes.some(like => like.username === username) ? 'up' : null,
              likes: Array.isArray(r.likes) ? r.likes : [],
            };
          })
        );
  
        setReviews(
          enrichedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.warn('Failed to fetch reviews:', error);
        Alert.alert('Error', 'Unable to load reviews.');
      }
    };
  
    fetchReviews();
  }, []);
    
  useEffect(() => {
    if (restaurant) fetchRestaurants(restaurant);
    else setFetchedRestaurants([]);
  }, [restaurant]);

  useEffect(() => {
    if (selectedReview) {
      const updated = reviews.find(r => r.id === selectedReview.id);
      if (updated) setSelectedReview(updated);
    }
  }, [reviews]);
  

  const handleStarPress = index => setRating(index + 1);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submitReview = async () => {
    if (isUserLoading) {
      alert(t('ui_loading_user_info'));
      return;
    }
  
    if (!username || username === 'Anonymous') {
      Alert.alert('Authentication Required', 'Please log in first to submit reviews.');
      return;
    }
  
    if (restaurant && review && rating) {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          Alert.alert('Error', 'Authentication token missing.');
          return;
        }
  
        const restaurantId = selectedRestaurantId || 'unknown-id';
  
        const response = await axios.post(
          `${REACT_APP_API_URL}/review`,
          {
            restaurantId,
            review,
            grade: rating,
            image,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const newReview = {
          ...response.data,
          id: Math.random().toString(),
          restaurant,
          review,
          rating,
          image,
          username,
          date: new Date().toLocaleString(),
          upVotes: 0,
          downVotes: 0,
          userVote: null,
        };
  
        await SecureStore.setItemAsync(`review-meta-${newReview.id}`, JSON.stringify({
          restaurant: restaurant,
          username: username,
        }));
  
        setReviews([newReview, ...reviews]);
        setRestaurant('');
        setSelectedRestaurantId(null);
        setReview('');
        setRating(0);
        setImage(null);
  
        Alert.alert('Success', 'Review submitted successfully!');
      } catch (error) {
        console.error('Failed to submit review:', error);
        Alert.alert('Error', 'Failed to submit review.');
      }
    } else {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
    }
  };
  
  const openReview = r => {
    setSelectedReview(r);
    setModalVisible(true);
  };

  const voteHandler = async (id, type) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }

      await axios.post(
        `${REACT_APP_API_URL}/review/${id}/vote`,
        {
          voteType: type,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setReviews(prev =>
        prev.map(r => {
          if (r.id !== id) return r;
  
          let newUpVotes = r.upVotes;
          let newDownVotes = r.downVotes;
          let newUserVote = r.userVote;
          let newLikes = [...r.likes]; 
  
          if (r.userVote === type) {
            newUserVote = null;
            if (type === 'up') {
              newUpVotes = r.upVotes - 1;
              newLikes = newLikes.filter(like => like.username !== username);
            } else {
              newDownVotes = r.downVotes - 1;
            }
          } else if (r.userVote === 'up' && type === 'down') {
            newUpVotes = r.upVotes - 1;
            newDownVotes = r.downVotes + 1;
            newUserVote = 'down';
            newLikes = newLikes.filter(like => like.username !== username);
          } else if (r.userVote === 'down' && type === 'up') {
            newDownVotes = r.downVotes - 1;
            newUpVotes = r.upVotes + 1;
            newUserVote = 'up';
            newLikes.push({ username: username });
          } else {
            newUserVote = type;
            if (type === 'up') {
              newUpVotes = r.upVotes + 1;
              newLikes.push({ username: username });
            } else {
              newDownVotes = r.downVotes + 1;
            }
          }
          return { ...r, upVotes: newUpVotes, downVotes: newDownVotes, userVote: newUserVote, likes: newLikes };
        })
      );

    } catch (error) {
      console.error('Failed to handle vote:', error);
      Alert.alert('Error', 'Failed to handle vote.');
    }
  };

  const fetchRestaurants = async query => {
    const keyword = `${query.trim()} in Oulu`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&key=${GOOGLE_PLACES_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const filtered = (data.results || []).filter(item =>
        (item.types || []).some(t => t === 'restaurant' || t === 'cafe')
      );
      setFetchedRestaurants(filtered);
    } catch {
      setFetchedRestaurants([]);
    }
  };

  const deleteReview = async (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('userToken');
              if (!token) {
                Alert.alert('Error', 'Authentication token missing.');
                return;
              }

              await axios.delete(`${REACT_APP_API_URL}/review/${reviewId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
              Alert.alert('Success', 'Review deleted successfully!');
            } catch (error) {
              console.log('Failed to delete review:', error);
              Alert.alert('Error', 'Failed to delete review.');
            }
          }
        }
      ]
    );
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reviews}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{t('ui_submit_review')}</Text>
              <View style={styles.searchSection}>
                <TextInput
                  value={restaurant}
                  onChangeText={setRestaurant}
                  placeholder={t('ui_restaurant_name')}
                  style={styles.searchInput}
                />
                {fetchedRestaurants.length > 0 && (
                  <View style={styles.listContainer}>
                    <ScrollView style={{ maxHeight: 200 }}>
                      {fetchedRestaurants.slice(0, 10).map(item => (
                        <TouchableOpacity
                          key={item.place_id}
                          onPress={() => {
                            setRestaurant(item.name);
                            setSelectedRestaurantId(item.place_id); 
                            setFetchedRestaurants([]);
                          }}
                          >
                          
                          <View style={styles.listItem}>
                            <Text style={styles.listTitle}>{item.name}</Text>
                            <Text style={styles.listAddress}>{item.formatted_address}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <TextInput
                value={review}
                onChangeText={setReview}
                placeholder={t('ui_description')}
                multiline
                style={styles.input}
              />
              <View style={styles.starContainer}>
                {[...Array(5)].map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
                    <Text style={i < rating ? styles.filledStar : styles.star}>
                      {i < rating ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                <Text style={styles.buttonText}>{t('ui_load_image')}</Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.previewImage} />}
              <TouchableOpacity
                onPress={submitReview}
                style={[styles.submitButton, isUserLoading && { backgroundColor: '#ccc' }]}
                disabled={isUserLoading}
              >
                <Text style={styles.submitButtonText}>{t('ui_submit_review')}</Text>
              </TouchableOpacity>
              <Text style={styles.reviewHeaderText}>{t('ui_reviews')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.thumbContainer}>
                <TouchableOpacity style={styles.thumbButtonLarge} onPress={() => voteHandler(item.id, 'up')}>
                  <Ionicons name="thumbs-up" size={32} color={item.userVote === 'up' ? '#6200EA' : '#888'} />
                  <Text style={styles.thumbCount}>{item.upVotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.thumbButtonLarge} onPress={() => voteHandler(item.id, 'down')}>
                  <Ionicons name="thumbs-down" size={32} color={item.userVote === 'down' ? '#6200EA' : '#888'} />
                  <Text style={styles.thumbCount}>{item.downVotes}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => openReview(item)} activeOpacity={0.8}>
                <View style={styles.reviewCardTop}>
                {item.avatar && (
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    )}
                  <Text style={styles.reviewTitle}>{item.restaurant}</Text>
                  <Text style={styles.reviewDescription}>{item.review}</Text>
                  <Text style={styles.reviewRating}>{'⭐'.repeat(item.rating)}</Text>
                  <Text style={{ fontStyle: 'italic', color: '#666' }}>
                    {t('ui_by')}: {item.username}
                  </Text>
                </View>
                <Text style={styles.reviewDate}>{item.date}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
              {userId === selectedReview?.userId && (
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReview(selectedReview.id)}>
                    <Ionicons name="trash-bin" size={24} color="#FF0000" />
                  </TouchableOpacity>
                )}
                <Text style={styles.modalTitle}>{selectedReview?.restaurant}</Text>
                {selectedReview?.image && <Image source={{ uri: selectedReview.image }} style={styles.modalImage} />}
                <Text style={styles.modalText}>{selectedReview?.review}</Text>
                <Text style={styles.modalRating}>{'⭐'.repeat(selectedReview?.rating || 0)}</Text>
                <Text style={{ fontStyle: 'italic', color: '#666' }}>
                  {t('ui_by')}: {selectedReview?.username}
                </Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>{selectedReview?.date}</Text>
                <View style={styles.modalThumbContainer}>
                  <TouchableOpacity onPress={() => voteHandler(selectedReview.id, 'up')}>
                    <Ionicons name="thumbs-up" size={32} color={selectedReview?.userVote === 'up' ? '#6200EA' : '#888'} />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 10 }}>{selectedReview?.upVotes}</Text>
                  <TouchableOpacity onPress={() => voteHandler(selectedReview.id, 'down')}>
                    <Ionicons name="thumbs-down" size={32} color={selectedReview?.userVote === 'down' ? '#6200EA' : '#888'} />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 10 }}>{selectedReview?.downVotes}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>{t('ui_close')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%' 
  },
  contentWrapper: { 
    width: '100%', 
    marginTop: 80, 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  searchSection: { 
    width: '90%', 
    marginBottom: 15,
  },
  searchInput: { 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2,
    marginBottom: 5,
  },
  listContainer: { 
    maxHeight: 200, 
    width: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginTop: 5, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  listItem: { 
    padding: 10, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#ccc' 
  },
  listTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#444',
  },
  listAddress: { 
    fontSize: 14, 
    color: '#777' 
  },
  input: { 
    width: '90%', 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    marginBottom: 15, 
    minHeight: 60, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2,
  },
  starContainer: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    justifyContent: 'center' 
  },
  star: { 
    fontSize: 32, 
    color: '#ccc', 
    marginHorizontal: 3,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2
  },
  filledStar: { 
    fontSize: 32, 
    color: '#FFD700', 
    marginHorizontal: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2
  },
  imageButton: { 
    backgroundColor: '#fff', 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center', 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2, 
    elevation: 2 
  },
  buttonText: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '600' 
  },
  previewImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  submitButton: { 
    backgroundColor: '#6200EA', 
    paddingVertical: 14, 
    paddingHorizontal: 30, 
    alignItems: 'center', 
    borderRadius: 30, 
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 3, 
    elevation: 3 
  },
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600',
    elevation: 2,
    textAlign: 'center',
  },
  reviewHeaderText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    alignSelf: 'center', 
  },
  reviewCard: { 
    backgroundColor: '#fff', 
    padding: 14, 
    marginVertical: 6, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4, 
    elevation: 3, 
    width: '90%', 
    alignSelf: 'center',
  },
  thumbContainer: { 
    flexDirection: 'row', 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    zIndex: 99,
  },
  thumbButtonLarge: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 30, 
    paddingVertical: 20, 
    marginLeft: 10,
  },
  thumbCount: { 
    fontSize: 14, 
    color: '#333', 
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reviewCardTop: { 
    width: '100%', 
    marginBottom: 8 
  },
  reviewImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    marginBottom: 8, 
    alignSelf: 'flex-start' 
  },
  reviewTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 4, 
    color: '#333', 
    textAlign: 'left', 
  },
  reviewDescription: { 
    fontSize: 14, 
    fontStyle: 'italic', 
    color: '#555', 
    marginBottom: 4, 
    textAlign: 'left',
  },
  reviewRating: { 
    fontSize: 14, 
    color: '#FFD700', 
    textAlign: 'left', 
    marginBottom: 4,
  },
  reviewDate: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 4, 
    textAlign: 'right',
    fontStyle: 'italic'
  },
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
    alignSelf: 'center',
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
    marginVertical: 10,
  },
  modalThumbContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 15,
    marginBottom: 10
  },
  closeButton: { 
    marginTop: 10, 
    padding: 10, 
    backgroundColor: '#6200EA', 
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    elevation: 2,
    shadowColor: '#000',
  },
  closeButtonText: { 
    color: '#fff', 
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 99,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
});

export default ReviewScreen;
