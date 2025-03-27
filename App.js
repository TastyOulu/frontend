import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}