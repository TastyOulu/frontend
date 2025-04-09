import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const MyLightTheme = {
  ...DefaultTheme,
  light: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    primary: '#0000FF', 
    border: '#dddddd',
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  light: false,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#121212',
    text: '#ffffff',
    primary: '#1e90ff',
    border: '#444444',
  },
};
