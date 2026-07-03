import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B35', // Punjabi orange
    onPrimary: '#FFFFFF',
    secondary: '#F8BBD0', // Pinkish
    onSecondary: '#000000',
    background: '#FFFFFF',
    onBackground: '#000000',
    surface: '#FFFFFF',
    onSurface: '#000000',
    error: '#B00020',
    onError: '#FFFFFF',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6B35',
    onPrimary: '#000000',
    secondary: '#F8BBD0',
    onSecondary: '#000000',
    background: '#121212',
    onBackground: '#FFFFFF',
    surface: '#121212',
    onSurface: '#FFFFFF',
    error: '#CF6679',
    onError: '#000000',
  },
};