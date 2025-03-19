import React from 'react';
import {View, Text, Button, StyleSheet} from "react-native";
import Background from '../components/Background';

export default function SearchScreen({ navigation }) {
    return (
        <Background>
        <View style={styles.container}>
            <Text>Search Screen</Text>
            <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Go to Forum" onPress={() => navigation.navigate('Forum')} />
            <Button title="Go to Info" onPress={() => navigation.navigate('Info')} />
            <Button title="Go to Reviews" onPress={() => navigation.navigate('Reviews')} />
            <Button title="Go to Search" onPress={() => navigation.navigate('Search')} />
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
        </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});