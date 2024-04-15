import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity, ScrollView, Button } from 'react-native'
import { useAppContext } from '../AppContext';
import axios from 'axios';
import * as Location from 'expo-location';
import AttendenceTemplate from './AttendenceTemplate';



export default function MainScreen() {
    //Navigation
    const navigation = useNavigation();
    //Context
    const { userFullName, userEmailOrMobile, accessToken, decodedBody } = useAppContext();
    //Variables
    const [attendanceData, setAttendenceData] = useState([]);
    const [showAttendenceList, setShowAttendenceList] = useState(false);
    const [attendencePercentage, setAttendencePercentage] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [userInfotext, setUserInfoText] = useState('Location 🚫 Blocked ');
    //Time
    const [currentTime, setCurrentTime] = useState(new Date());
    const isEightAM = currentTime.getHours() === 8 && currentTime.getMinutes() === 0;
    //Date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    //Functions
    const getLocationPermission = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        } catch (error) {
            console.error('Error getting location permission:', error);
            setErrorMsg('Error getting location permission');
        }
    };

    const getCurrentLocation = async () => {
        console.log("Getting current location.......")
        try {
            Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 }, (e) => {
                console.log("lattitude -> ", e.coords.latitude)
                console.log("longitude -> ", e.coords.latitude)

                async function validateLocation() {
                    try {
                        const body = {
                            latitude: e.coords.latitude.toFixed(6),
                            longitude: e.coords.longitude.toFixed(6)
                        }
                        console.log("Validating with keycloak ->", body);
                        const locationResponse = await axios.post('http://192.168.0.115:8080/auth/realms/we-trade/users/userlocation', body)
                        console.log("Location response", locationResponse.data)
                        if (locationResponse.data.status_code == 200) {
                            setIsButtonDisabled(false)
                            setUserInfoText('Location ✅ allowed')
                        }
                    } catch (error) {
                        console.log(error)
                        setIsButtonDisabled(true)
                        setUserInfoText('Location 🚫  blocked')
                    }
                }
                validateLocation()

            })

        } catch (error) {
            console.error('Error getting current location:', error);
            setErrorMsg('Error getting current location');
        }
    };



    //postAttendence
    async function postAttendence() {
        try {
            console.log("--Posting attendence--")
            if (isButtonDisabled === false) {
                try {
                    const response = await axios.post('http://192.168.0.188:3000/attendence', decodedBody, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(response.data);
                    if (response.data.message == "Attendance marked successfully") {
                        ToastAndroid.show('Attendence marked successfully!', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Attendence alredy marked!', ToastAndroid.SHORT);
                    }
                    //getAttendenceList()
                } catch (error) {
                    console.error('Error:', error);
                    ToastAndroid.show('Error while posting ', ToastAndroid.SHORT);

                }
            }
            else {
                console.log(locationResponse.data.message)
                ToastAndroid.show('Something went wrong :(', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Your not inside the desierd location,Kindly enter into collage', ToastAndroid.SHORT);
        }
    }

    //getAttendence
    async function getAttendenceList() {
        try {
            const response = await axios.post('http://192.168.0.188:3000/attendenceList', decodedBody, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Attendence list -> ", response.data);
            setAttendenceData(response.data);
            setShowAttendenceList(true)
            calculateAttendancePercentage()
        } catch (error) {
            console.error('Error:', error);
        }
    }
    //calucltePercentage
    function calculateAttendancePercentage() {
        console.log(attendanceData)

        const start = new Date(attendanceData.at(0).date);
        const end = new Date(attendanceData.at(-1).date);

        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const datesPresent = new Set();

        attendanceData.forEach(entry => {
            if (entry.status === "present") {
                datesPresent.add(entry.date);
            }
        });

        const daysPresent = datesPresent.size;
        const daysAbsent = totalDays - daysPresent;
        const daysAbsentPercentage = (daysAbsent / totalDays) * 100;
        const daysPresencePercentage = 100 - daysAbsentPercentage;
        setAttendencePercentage(daysPresencePercentage.toFixed(2))
        console.log("Attednece percentage is -------> ", daysAbsentPercentage)
    }


    //useEffects
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
    }, []);

    useEffect(() => {
        console.log("----Location useEffect-----");
        getCurrentLocation()
    }, []);



    return (
        <View style={styles.main}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.email}>{userEmailOrMobile}</Text>
            <Text style={styles.email}>{userInfotext}</Text>
            <View style={styles.timeContainer}>
                <View style={styles.timeContainer_Row1}>
                    <Text style={styles.timeText}>Working Schedule</Text>
                    <Text style={styles.timeText}>{formattedDate}</Text>
                </View>
                <Text style={styles.currentTime}>{currentTime.toLocaleTimeString()}</Text>
                <TouchableOpacity
                    style={isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled}
                    disabled={isButtonDisabled}
                    onPress={() => { postAttendence() }}>
                    <Text style={styles.buttonText}>Check In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonEnabled}
                    onPress={() => { getAttendenceList() }}>
                    <Text style={styles.buttonText}>Attendence Data</Text>
                </TouchableOpacity>

            </View>
            {
                showAttendenceList &&
                <>
                    <Text style={styles.attendencePercentageText}>YOUR ATTENDENCE PERCENTAGE IS :{attendencePercentage}</Text>
                    <ScrollView style={{ backgroundColor: 'lightgrey', width: 380, borderRadius: 5, marginLeft: 8 }}>
                        {
                            attendanceData.map(i => {
                                return (
                                    <AttendenceTemplate
                                        key={Math.random()}
                                        date={i.date}
                                        session={i.session}
                                        status={i.status}
                                        time={i.time ? i.time : null}
                                    />
                                )
                            })
                        }
                    </ScrollView>

                </>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        alignContent: 'center',
        backgroundColor: 'white',
        height: 900,
        padding: 10
    },
    welcome: {
        fontWeight: 'normal',
        fontSize: 20,
        color: 'green',
        marginTop: 50
    },
    email: {
        fontWeight: 'normal',
        fontSize: 20,
        color: 'black'
    },
    timeContainer: {
        display: 'flex',
        backgroundColor: 'lightgrey',
        height: 200,
        width: 350,
        borderRadius: 5,
        marginTop: 40,
        marginLeft: 20,
        padding: 10,
        marginBottom: 20
    },
    timeContainer_Row1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timeText: {
        fontWeight: 'normal',
        color: 'black',
        fontSize: 15
    },
    currentTime: {
        fontSize: 20,
        marginLeft: '40%',
        marginTop: '5%',
        // fontSize: 20
    },
    buttonEnabled: {
        backgroundColor: 'green',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        width: 200,
        marginLeft: 70,
        marginTop: 15
    },
    buttonDisabled: {
        backgroundColor: 'grey',
        opacity: 1,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        width: 200,
        marginLeft: 70,
        marginTop: 15
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    attendanceList: {
        marginTop: 20,
        width: '100%',
    },
    attendanceListTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    attendencePercentageText: {
        fontWeight: 'normal',
        fontSize: 15,
        color: 'black',
        marginBottom: 10,
        marginLeft: 40
    }
});