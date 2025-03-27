import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForumScreen from '../screens/ForumScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SearchScreen from '../screens/SearchScreen';
import InfoScreen from '../screens/InfoScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import LanguageSwitcher from '../LanguageSwitcher';
import ForgotPassword from '../screens/ForgotPassword';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DrawerMenuButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginRight: 15, padding: 8 }}
    >
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Info" component={InfoScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons = {
          HomeTab: 'home',
          Profile: 'person-outline',
          Forum: 'chatbubble',
          Reviews: 'star',
          Search: 'search',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: '#0000FF',
      tabBarInactiveTintColor: '#000',
      headerShown: false,
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
    <Tab.Screen name="Forum" component={ForumScreen} />
    <Tab.Screen name="Reviews" component={ReviewsScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Drawer
const DrawerNavigator = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
        drawerType="slide"
        screenOptions={({ navigation }) => ({
            headerShown: true,
            drawerPosition: "right",
            statusBarColor: 'red', // <-- Tämä toimii Androidilla!
            statusBarStyle: 'dark', // <-- Tämä toimii iOS:llä tai Expo-go:lla
            //headerStatusBarHeight:Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            drawerActiveBackgroundColor: 'lightblue',
            drawerInactiveBackgroundColor: 'transparent',
            drawerActiveTintColor: '#fff',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                fontSize: 20,
            },
            headerStyle: {
                backgroundColor: 'white',
                //elevation: 0,
                //shadowOpacity: 0,
                borderBottomWidth: 0,
               
            },
            headerTitle: '',
            //headerTransparent: true,
            // even on the navigation page, I'm already getting lost.
            headerLeft: () => {
                if (navigation.canGoBack()) {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ marginLeft: 15, padding: 8 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    );
                }
                return null;
            },
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    style={{ marginRight: 15, padding: 8 }}
                >
                    <Ionicons name="menu" size={24} color="black" />
                </TouchableOpacity>
            ),
        })}
    >
      <Drawer.Screen name="Main" component={TabNavigator} />
      <Drawer.Screen name="ProfileDrawer" component={ProfileScreen} />
      <Drawer.Screen name="InfoDrawer" component={InfoScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Signup" component={SignupScreen} />
      <Drawer.Screen name="ForumDrawer" component={ForumScreen} />
      <Drawer.Screen name="ReviewsDrawer" component={ReviewsScreen} />
      <Drawer.Screen name="SearchDrawer" component={SearchScreen} />
    </Drawer.Navigator>
  );
};

// Main stack
const MainNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
);

export default MainNavigator;
