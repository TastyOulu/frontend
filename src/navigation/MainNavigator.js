import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForumScreen from '../screens/ForumScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import SearchScreen from '../screens/SearchScreen';
import InfoScreen from '../screens/InfoScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
);

// bottom tab
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
                position: 'absolute',
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

// side menu drawer
const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerType="slide"
        screenOptions={({ navigation }) => ({
            drawerPosition: "right",
            drawerActiveBackgroundColor: 'lightblue',
            drawerInactiveBackgroundColor: 'transparent',
            drawerActiveTintColor: '#fff',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
                fontSize: 20,
            },
            headerStyle: {
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTitle: '',
            headerTransparent: true,
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
        <Drawer.Screen
            name="Main"
            component={TabNavigator}
            options={{
                title: 'Home',
                drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
            }}
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
            name="Login"
            component={LoginScreen}
            options={{
                drawerIcon: ({ color }) => <Ionicons name="log-in" size={22} color={color} />,
            }}
        />
        <Drawer.Screen
            name="Signup"
            component={SignupScreen}
            options={{
                drawerIcon: ({ color }) => <Ionicons name="person-add" size={22} color={color} />,
            }}
        />
        <Drawer.Screen
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
        />
    </Drawer.Navigator>
);

const MainNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
    </Stack.Navigator>
);

export default MainNavigator;