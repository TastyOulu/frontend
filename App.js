import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ForumScreen from './src/screens/ForumScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import SearchScreen from './src/screens/SearchScreen';
import InfoScreen from './src/screens/InfoScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar barStyle="default" />
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={({ route, navigation }) => ({
					headerStyle: {
						backgroundColor: 'transparent',
						borderBottomWidth: 0,
						elevation: 0,
						shadowOpacity: 0,
					},
					headerTransparent: true,
					headerTitle: '',
					headerBackVisible: false,
					headerLeft: () => {
						if (route.name === 'Home') {
							return (
								<TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginLeft: 15 }}>
									<Ionicons name="log-in" size={24} color="black" />
								</TouchableOpacity>
							);
						} else {
							return (
								<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
									<Ionicons name="arrow-back" size={24} color="black" />
								</TouchableOpacity>
							);
						}
					},
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 15 }}>
							<Ionicons name="menu" size={24} color="black" />
						</TouchableOpacity>
					),
				})}
			>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Forum" component={ForumScreen} />
				<Stack.Screen name="Info" component={InfoScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
				<Stack.Screen name="Reviews" component={ReviewsScreen} />
				<Stack.Screen name="Search" component={SearchScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
