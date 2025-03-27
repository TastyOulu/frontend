import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { StatusBar } from 'react-native'


export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
			
					<MainNavigator />
			
			</NavigationContainer>
		</SafeAreaProvider>
	);
}