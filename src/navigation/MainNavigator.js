import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Image } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native'
import { useTheme } from '@react-navigation/native';



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

const Component = require('../../assets/Component 3.png');

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
    {/*<Tab.Screen name="Profile" component={ProfileScreen} />*/}
  </Tab.Navigator>
);

// Drawer
const DrawerNavigator = () => {

    const { dark,colors } = useTheme();
  return (
    <>
    
    <Drawer.Navigator
      drawerType="slide"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTintColor: colors.text,
        drawerPosition: "right",
        //statusBarColor: 'red',
        //statusBarStyle: 'dark',
        drawerActiveBackgroundColor: colors.border,
        //drawerInactiveBackgroundColor: 'transparent',
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontSize: 20,
        
        },
        headerStyle: {
          backgroundColor: '#E6CCFF',
          //elevation: 0,
          borderBottomWidth: 0,
        },
        headerTitle: () => <Image source={Component} style={{ width: 150, height: 60, resizeMode: 'contain', marginTop: 20 }} />,
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
        headerTitleAlign: 'center',
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
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={22} color={color} />
            ),
        }}
        listeners={({ navigation }) => ({
            drawerItemPress: (e) => {
                e.preventDefault();
                navigation.dispatch(
                    CommonActions.reset({
                    index: 0,
                    routes: [
                        { 
                            name: 'Main',
                            state: {
                                routes: 
                                [{ name: 'HomeTab' }],
                            },
                        }
                    ],
                })
            )
            },

            })}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="InfoDrawer"
        component={InfoScreen}
        options={{
          title: 'Info',
          drawerIcon: ({ color }) => <Ionicons name="information-circle-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="DummyLogin"
        options={{
            drawerLabel: 'Login / Signup',
            drawerIcon: ({ color }) => <Ionicons name="log-in" size={22} color={color} />,
        }}
        listeners={({ navigation }) => ({ 
            drawerItemPress: (e) => {
                e.preventDefault();
                navigation.navigate('Login');
            },
            })}  
        >
            {() => null}
        </Drawer.Screen>
      
      {/*<Drawer.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="person-add" size={22} color={color} />,
        }}
      />
      {/*<Drawer.Screen
        name="ForumDrawer"
        component={ForumScreen}
        options={{
          title: 'Forum',
          drawerIcon: ({ color }) => <Ionicons name="chatbubble" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ReviewsDrawer"
        component={ReviewsScreen}
        options={{
          title: 'Reviews',
          drawerIcon: ({ color }) => <Ionicons name="star" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="SearchDrawer"
        component={SearchScreen}
        options={{
          title: 'Search',
          drawerIcon: ({ color }) => <Ionicons name="search" size={22} color={color} />,
        }}
      />*/}
      <Drawer.Screen
        name="languages"
        component={LanguageSwitcher}
        options={{
          title: 'Languages',
          drawerIcon: ({ color }) => <Ionicons name="language" size={22} color={color} />,
        }}
        />
    </Drawer.Navigator>
    </>
  );
};

// Main stack
const MainNavigator = () => {
    const {colors,dark} = useTheme();

    return (
  <Stack.Navigator screenOptions={{headerShown: false }}>
    <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
    );
};

export default MainNavigator;
