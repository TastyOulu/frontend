import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';

const windowWidth = Dimensions.get('window').width;
const CURRENT_USER = "Joulupukki88";
const topicColors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];

export default function ForumScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleAddTopic = () => {
    if (newTopic.trim() !== "") {
      setTopics([...topics, newTopic]);
      setMessages({ ...messages, [newTopic]: [] });
      setNewTopic("");
      setModalVisible(false);
    }
  };

  const handleAddMessage = () => {
    if (newMessage.trim() !== "") {
      const updatedMessages = { ...messages };
      const newMsg = {
        user: CURRENT_USER,
        text: newMessage,
        likes: 0,
      };
      updatedMessages[selectedTopic].push(newMsg);
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  const handleLikeMessage = (index) => {
    const updatedMessages = { ...messages };
    updatedMessages[selectedTopic][index].likes += 1;
    setMessages(updatedMessages);
  };

  return (
    <GradientBackground statusBarStyle="dark">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        {!selectedTopic ? (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Ionicons
                name="fast-food"
                size={28}
                color="white"
                style={styles.foodIcon}
              />
              <Text style={styles.forumTitle}>FORUM</Text>
            </View>

            <View style={styles.topicList}>
              {topics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.topicButton,
                    { backgroundColor: topicColors[index % topicColors.length] }
                  ]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.newTopicButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.newTopicText}>Start a New Topic</Text>
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalBackButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Create New Topic</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your topic..."
                    value={newTopic}
                    onChangeText={setNewTopic}
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddTopic}
                  >
                    <Text style={styles.submitText}>Add Topic</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        ) : (
          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <TouchableOpacity onPress={() => setSelectedTopic(null)}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <View style={styles.topicTitleContainer}>
                <Text style={styles.selectedTopicTitle}>{selectedTopic}</Text>
              </View>
            </View>

            <ScrollView style={styles.messageList}>
              {(messages[selectedTopic] || []).map((message, index) => (
                <View key={index} style={styles.messageBubble}>
                  <View style={styles.userRow}>
                    <Ionicons name="person-circle-outline" size={20} color="#fff" />
                    <Text style={styles.userName}>{message.user}</Text>
                  </View>
                  <Text style={styles.messageText}>{message.text}</Text>
                  <View style={styles.likeRow}>
                    <TouchableOpacity onPress={() => handleLikeMessage(index)}>
                      <Ionicons name="heart-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.likesCount}>{message.likes} likes</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Write a message..."
                placeholderTextColor="#999"
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity onPress={handleAddMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  forumTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  foodIcon: {
    position: 'absolute',
    left: 0,
  },
  topicList: {
    width: '100%',
    marginTop: 20,
  },
  topicButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  topicText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  newTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  newTopicText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.9,
    maxWidth: 400,
    position: 'relative'
  },
  modalBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  messageContainer: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  topicTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedTopicTitle: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    color: '#fff',
    marginLeft: 8,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff5da2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
