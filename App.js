import './src/i18n'; // ennen mitään React-komponentteja
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/contexts/AuthContext';
import {useColorScheme } from 'react-native';
import { MyLightTheme, MyDarkTheme } from './src/theme/theme';



export default function App() {
	const systemScheme = useColorScheme();
	const theme = systemScheme === 'dark' ? MyDarkTheme : MyLightTheme;
    return (
        <AuthProvider>
			<StatusBar 
				style={theme.light ? 'dark' : 'light'}
				backgroundColor={theme.colors.card} 
				translucent={false}
				/>
            <NavigationContainer theme={theme}>
                <MainNavigator />
            </NavigationContainer>
        </AuthProvider>
		
    );
}