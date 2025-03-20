import React from 'react';
import {
	StyleSheet,
	Text,
	Button,
	Image,
	View,
	ScrollView,
	StatusBar,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Background from '../components/Background';
import { Ionicons } from '@expo/vector-icons';
import ReviewScreen from './ReviewsScreen';

const component = require('../../assets/FAQ.png');

const IconRow = () => (
	<View style={{ flexDirection: 'row' }}>
		<Ionicons name='star' size={22} color='black' style={{ marginRight: 10 }} />
		<Ionicons
			name='trophy'
			size={22}
			color='black'
			style={{ marginRight: 10 }}
		/>
		<Ionicons
			name='diamond'
			size={22}
			color='black'
			style={{ marginRight: 10 }}
		/>
	</View>
);

export default function InfoScreen({ navigation }) {
	return (
		<Background>
			<View style={styles.header}>
				<Image source={component} />
			</View>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.container}>
					<View style={[styles.box, styles.box1]}>
						<Text style={styles.title}>How to Earn Points</Text>
						<Text style={styles.subtitle}>
							Earn points by leaving reviews and getting likes from other users.
						</Text>
					</View>
					<View style={[styles.box, styles.box2]}>
						<Text style={styles.title}>What are those three stages?</Text>
						<Text style={styles.subtitle}>
							<IconRow />
						</Text>
					</View>
					<View style={[styles.box, styles.box3]}>
						<Text style={styles.title}>Why I want to get points?</Text>
						<Text style={styles.subtitle}>
							You can get points by leaving reviews and getting likes from other
							users.
						</Text>
					</View>
				</View>
			</ScrollView>
		</Background>
	);
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flexGrow: 1,
	},
	container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 120,
		paddingBottom: 20,
	},
	box: {
		width: '90%',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		paddingBottom: 20,
		marginBottom: 20,
	},
	box1: {
		backgroundColor: '#9859FC',
	},
	box2: {
		backgroundColor: '#FF74AB',
	},
	box3: {
		backgroundColor: '#FAD160',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
		paddingBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#000',
		paddingHorizontal: 20,
	},
});
