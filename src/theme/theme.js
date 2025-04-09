import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const MyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    background: '#ffffff',
    card: '#f0f0f0',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#ff80ab',
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',
    background: '#121212',
    card: '#1f1f1f',
    text: '#ffffff',
    border: '#272727',
    notification: '#ff80ab',
  },
};
