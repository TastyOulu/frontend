import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function GradientBackground({
  children,
  colors = ['#E6CCFF', '#D1A3FF', '#C084FC', '#A566FF', '#7D3C98'],
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  statusBarStyle = 'light',
  padding = 20,
}) {
  const topPadding = Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0;

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={styles.gradient}
    >
      <StatusBar style={statusBarStyle} translucent={false} />
      
      <View style={[styles.contentContainer, { paddingTop: topPadding, paddingHorizontal: padding }]}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
