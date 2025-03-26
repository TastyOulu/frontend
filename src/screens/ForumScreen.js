import React from "react";
import {Text,StyleSheet} from "react-native";
import GradientBackground from "../components/GradientBackground";

export default function ForumScreen({ navigation }) {
    return (
        <GradientBackground>
            <Text>Forum Screen</Text>
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});