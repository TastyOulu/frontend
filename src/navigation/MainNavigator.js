import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Image,View,StyleSheet, Platform,StatusBar } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native'
import { useTheme } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
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
          HomeTab: 'home-outline',
          Profile: 'person-outline',
          Forum: 'chatbubble-outline',
          Reviews: 'star-outline',
          Search: 'search-outline',
        };
        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 0,
      },
      tabBarActiveTintColor: 'purple',
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

const DrawerNavigator = () => {
  const { colors, dark } = useTheme();

  return (
    <>
     <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
        animated={true}
      />
    <Drawer.Navigator
        drawerContent={(props) => (
            <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
            >
            {/* Yläosa: DrawerItemList renderöidään normaalisti */}
            <View>
                <DrawerItemList {...props} />
            </View>

            {/* Alareuna: LanguageSwitcher näkyviin */}
            <View style={styles.languageContainer}>
                <LanguageSwitcher />
            </View>
            </DrawerContentScrollView>
        )}
      drawerType="slide"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTintColor: colors.text,
        drawerPosition: "right",
        drawerActiveBackgroundColor: colors.border,
        drawerActiveTintColor: 'purple',
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontSize: 20,
        
        },
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 0,
        },
        headerTitle: () => <Image source={Component} style={{ width: 150, height: 60, resizeMode: 'contain', marginTop: Platform.OS === 'ios' ? 0:20, }} />,
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
                        routes: [{ name: 'HomeTab' }],
                      },
                    },
                  ],
                })
              );
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
            drawerIcon: ({ color }) => (
              <Ionicons name="information-circle-outline" size={22} color={color} />
            ),
          }}
        />
       
        <Drawer.Screen
          name="DummyLogin"
          options={{
            drawerLabel: 'Login / Signup',
            drawerIcon: ({ color }) => <Ionicons name="log-out-outline" size={22} color={color} />,
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
      </Drawer.Navigator>
    </>
  );
};

const MainNavigator = () => {
  const { colors, dark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
        animated={true}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
    languageContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    })

export default MainNavigator;
