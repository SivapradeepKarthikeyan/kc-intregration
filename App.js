import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider, useAppContext } from './AppContext';
import AppWrapper from './AppWrapper';



//Navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//const { openRoutes, setOpenRoutes } = useAppContext();


export default function App() {

  const [openRoutes, setOpenRoutes] = useState(false);

  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
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
