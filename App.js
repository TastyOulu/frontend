import './src/i18n';
import React, { useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { useColorScheme } from 'react-native';
import { MyLightTheme, MyDarkTheme } from './src/theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const systemScheme = useColorScheme();
  const theme = systemScheme === 'dark' ? MyDarkTheme : MyLightTheme;
  const navigationReadyRef = useRef(false);

  const applyStatusBar = useCallback(() => {
    setStatusBarStyle(theme.light ? 'dark' : 'light', true);
  }, [theme]);

  return (
    <AuthProvider>
      
      <StatusBar style={theme.light ? 'dark' : 'light'} translucent={false} />
      
      <NavigationContainer
        theme={theme}
        onReady={() => {
          navigationReadyRef.current = true;
          applyStatusBar(); 
        }}
        onStateChange={applyStatusBar} 
      >
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
