import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GradientBackground({
  children,
  colors = ['#E6CCFF', '#D1A3FF', '#C084FC', '#A566FF', '#7D3C98'],
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  statusBarStyle = 'light',
  padding = 20,
}) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={styles.gradient}
    >
      <StatusBar style={statusBarStyle} />
      {/*<SafeAreaView style={[styles.safeArea, { padding }]}>*/}
        {children}
      {/*</SafeAreaView>*/}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

