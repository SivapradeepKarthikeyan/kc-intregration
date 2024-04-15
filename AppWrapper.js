import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import { AppProvider, useAppContext } from './AppContext';

//Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppWrapper() {

    //Context
    const { isLoggedIn, setIsLoggedIn } = useAppContext();
    return (
        <>
            {
                isLoggedIn ?
                    (
                        <NavigationContainer>
                            <Stack.Navigator>
                                <Tab.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    )
                    :
                    (
                        <LoginScreen options={{ headerShown: false }} />
                    )
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
