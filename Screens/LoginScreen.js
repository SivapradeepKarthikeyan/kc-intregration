import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { TouchableOpacity, Text, View, StyleSheet, Image } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../AppContext';




WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen(props) {

    //Context
    const { setUserFullName, setUserEmailOrMobile, setAccessToken, setIdToken, setIsLoggedIn, setDecodedBody } = useAppContext();

    //KC 
    const discovery = useAutoDiscovery('http://192.168.0.188:8090/auth/realms/BIT');

    //Create and load an auth request
    const [request, result, promptAsync] = useAuthRequest({
        clientId: 'BIT_attendence_application',
        clientSecret: 'd6758606-6db1-425f-af62-24cf09e6fb4d',
        redirectUri: makeRedirectUri({ scheme: "exp://192.168.0.188:8081" }),
        scopes: ['openid'],
        responseType: 'token id_token',
        responseMode: 'fragment',
        extraParams: {
            nonce: 'b2z72mrnwfd',
        },

        state: '9dveid7der'
    },
        discovery
    );


    // Login
    async function doLogin() {
        try {
            const authRes = await promptAsync()

            let accessToken = authRes.params.access_token;
            let idToken = authRes.params.id_token;
            setAccessToken(accessToken)
            setIdToken(idToken)

            let token = authRes?.authentication.accessToken.split('.');
            const decodedBody = jwtDecode(token[1], { header: true });

            setDecodedBody(decodedBody)
            setUserFullName(decodedBody.preferred_username);
            setUserEmailOrMobile(decodedBody.email);
            setIsLoggedIn(true)

        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <View style={styles.login}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/7/77/Bannari_Amman_Institute_of_Technology_logo.png' }}
                style={styles.logo} />
            <TouchableOpacity
                style={styles.buttonEnabled}
                onPress={() => { doLogin() }}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    login: {
        display: 'flex',
        height: 700,
        width: 430,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    welcome_Text: {
        fontWeight: '200',
        fontSize: '500'
    },
    logo: {
        height: 120,
        width: 150,
        marginTop: 20,
        marginBottom: 30
    },
    buttonEnabled: {
        backgroundColor: 'green',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        width: 200,
        marginLeft: 5,
        marginTop: 15,
        color: 'white'
    },


});
