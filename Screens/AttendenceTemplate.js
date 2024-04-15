import React from 'react';
import { View, StyleSheet, Text, Image, Share } from 'react-native';

export default function AttendenceTemplate(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>DATE : {props.date}</Text>
      <Text style={styles.text}>SESSION : {props.session}</Text>
      <Text style={styles.text}>STATUS : {props.status}</Text>
      <Text style={styles.text}>TIME : {props.time}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 350,
    backgroundColor: 'lightgrey',
    borderColor: 'black',
    borderRadius: 2,
    // borderWidth: 1,
    display: 'flex',
    padding: 15,
    margin: 5,
    marginLeft: 20
  },
  text: {
    fontWeight: 'normal',
    color: 'black',
    fontSize: 15
  }
})
