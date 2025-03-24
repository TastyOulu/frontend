import React from 'react';
import { View, Image, StyleSheet,Text,Pressable } from 'react-native';
import Background from '../components/Background';
import AdCarousel from '../components/AdCarousel'


const Component = require('../../assets/Component 3.png');



export default function HomeScreen({ navigation }) {
    return (
        <Background>
            <View style={styles.container}>
                 <View style={{marginTop: 40}}>
                                         <Image source={Component} style={{width: 305, height: 159,resizeMode: 'contain'}} />
                                         <Text style={{fontSize: 36,fontStyle:'italic',}}>“TastyOulu - your window to Oulu’s restaurant world”</Text>
                                     </View>
                <View style={{marginTop: 40}}>
                    <Pressable onPress={() => navigation.navigate('Info')}>
                                                                <Text style={{fontSize:18}}>Write a review and earn points! Start sharing your experiences today. 
                                                                    See more information 
                                                                    <Text style={{color:'purple',textDecorationLine:'underline'}}> here.</Text>
                                                                </Text>
                                                        </Pressable>
                </View>
                <View>
                    <Text style={{fontSize: 18,fontWeight:'bold',marginTop: 20,marginBottom:20}}>Best offers in this month:</Text>
                   
                    <AdCarousel/>
                    
                </View>
                
                <View>
                    <Text style={{fontSize: 18,fontWeight:'bold',marginTop: 10}}>Top 5 restaurant</Text>
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});