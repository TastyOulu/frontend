import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar barStyle="default" />
			<Tab.Navigator
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
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Forum" component={ForumScreen} />
				<Tab.Screen name="Info" component={InfoScreen} />
				<Tab.Screen name="Reviews" component={ReviewsScreen} />
				<Tab.Screen name="Search" component={SearchScreen} />
				<Tab.Screen name="Profile" component={ProfileScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}