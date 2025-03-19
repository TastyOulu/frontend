import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/Background';

const ReviewScreen = () => {
    const [restaurant, setRestaurant] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [image, setImage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

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
            };
            setReviews([newReview, ...reviews]);
            setRestaurant('');
            setReview('');
            setRating(0);
            setImage(null);
        }
    };

    const openReview = (review) => {
        setSelectedReview(review);
        setModalVisible(true);
    };

    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.title}>Submit your review</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={restaurant}
                        onChangeText={setRestaurant}
                        placeholder="Restaurant name"
                        style={styles.input}
                    />
                    <TextInput
                        value={review}
                        onChangeText={setReview}
                        placeholder="Description"
                        multiline
                        style={styles.input}
                    />
                </View>
                <View style={styles.starContainer}>
                    {[...Array(5)].map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                            <Text style={styles.star}>{index < rating ? '⭐' : '☆'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                    <Text>Load image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
                <TouchableOpacity onPress={submitReview} style={styles.submitButton}>
                    <Text style={styles.submitText}>Submit Review</Text>
                </TouchableOpacity>

                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openReview(item)}>
                            <View style={styles.reviewCard}>
                                {item.image && <Image source={{ uri: item.image }} style={styles.reviewImage} />}
                                <Text style={styles.reviewTitle}>{item.restaurant}</Text>
                                <Text numberOfLines={2}>{item.review}</Text>
                                <Text>{'⭐'.repeat(item.rating)}</Text>
                                <Text style={styles.reviewDate}>{item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedReview && (
                            <>
                                <Text style={styles.modalTitle}>{selectedReview.restaurant}</Text>
                                {selectedReview.image && (
                                    <Image source={{ uri: selectedReview.image }} style={styles.modalImage} />
                                )}
                                <Text style={styles.modalText}>{selectedReview.review}</Text>
                                <Text>{'⭐'.repeat(selectedReview.rating)}</Text>
                                <Text style={styles.reviewDate}>{selectedReview.date}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
    container: {
        flex: 1,
        paddingTop: 80,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    star: {
        fontSize: 30,
    },
    imageButton: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#6200EA',
        padding: 12,
        alignItems: 'center',
        width: '90%',
        borderRadius: 5,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reviewCard: {
        backgroundColor: 'white',
        padding: 12,
        marginTop: 10,
        borderRadius: 5,
        width: '90%',
    },
    reviewImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#6200EA',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
    },
    reviewDate: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
});

export default ReviewScreen;
