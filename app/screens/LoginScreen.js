import { StyleSheet, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import CustomText from '../components/CustomText';
import colors from '../config/colors';
import * as Animatable from 'react-native-animatable'
import AppStateContext from '../components/AppStateContext';
import { useNavigation } from '@react-navigation/core';
import CustomButton from '../components/CustomButton';
import { auth, db } from '../../firebase';
import consts from '../config/consts';

const SplashScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { context, setContext } = useContext(AppStateContext);

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Main")
            }
        })

        return unsubscribe
    }, [])

    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                const uid = auth.currentUser?.uid;

                db.collection("user").doc(auth.currentUser?.uid).get().then(doc => {
                    return doc.data().username;
                }).then(data => setContext({username: data, uid: uid}));
            })
            .catch(error => alert(error.message))
    }

    const redirectToSignup = () => {
        navigation.navigate("Signup");
    }

    return (
        <View styles={styles.container}>
            <ImageBackground style={{ width: "100%", height: "100%", overflow: 'hidden' }}
                source={require("./../assets/images/Bookswall_generated.png")}>
                <Animatable.View style={styles.header}
                    animation="fadeInDownBig">
                    <CustomText text={"Find your next favorite book!"} color={colors.white}
                        weight={"extra-bold"} size={30} align="center"
                        textShadowOffset={{ width: 2, height: 2 }}
                        textShadowRadius={20}
                        textShadowColor={"#131713"} />
                </Animatable.View>
                <Animatable.View style={styles.footer}
                    animation={"fadeInUpBig"}
                    delay={300}>
                    <CustomText text={"Start tracking your books now!"}
                        color={colors.primaryColor} size={24}
                        weight={"bold"} align="center" />
                    <View
                        style={styles.container}
                        behavior="padding"
                    >

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={text => setEmail(text)}
                                style={[styles.input, { fontFamily: "Montserrat-Regular" }]}
                            />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={text => setPassword(text)}
                                style={[styles.input, { fontFamily: "Montserrat-Regular" }]}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                text={"Login"}
                                onPress={handleLogin}
                                weight={"bold"}
                                width={"100%"}
                            ></CustomButton>
                            <TouchableOpacity onPress={redirectToSignup}>
                                <View style={styles.register}>
                                    <CustomText text={"Register"} color={colors.primaryColor} weight="medium" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animatable.View>
            </ImageBackground>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    header: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 2.8,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    inputContainer: {
        width: '80%',
        marginTop: 15,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: consts.borderRadius,
        marginTop: 10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    register: {
        marginTop: 15,
    }
})