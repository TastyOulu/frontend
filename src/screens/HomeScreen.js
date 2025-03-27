import React from 'react';
import { View, Image, StyleSheet,Text,Pressable,StatusBar } from 'react-native';
import AdCarousel from '../components/AdCarousel'
import { ScrollView } from 'react-native-gesture-handler';
import GradientBackground from '../components/GradientBackground';


const Component = require('../../assets/Component 3.png');



export default function HomeScreen({ navigation }) {
    return (
        <GradientBackground>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{backgroundColor: 'white',width: '100%',alignItems: 'center',justifyContent: 'center'}}>
                                            <Image source={Component} style={{width: 305, height: 159,resizeMode: 'contain',marginTop:20}} />
                                            <Text style={{fontSize: 18,fontStyle:'italic',padding:10}}>“TastyOulu - your window to Oulu’s restaurant world”</Text>
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
                        <Text style={{fontSize: 24,fontWeight:'bold',marginTop: 20,marginBottom:20,textAlign:'center'}}>Best offers in this month:</Text>
                    
                        <AdCarousel/>
                        
                    </View>
                    
                    <View>
                        <Text style={{fontSize: 24,fontWeight:'bold',marginTop: 10}}>Top 5 restaurant</Text>
                        
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingTop: 20,
        //marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});