import { StyleSheet, KeyboardAvoidingView, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import CustomText from '../components/CustomText';
import colors from '../config/colors';
import AppStateContext from '../components/AppStateContext';
import { useNavigation } from '@react-navigation/core';
import CustomButton from '../components/CustomButton';
import { auth, db } from '../../firebase';
import consts from '../config/consts';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
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

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                setContext({username: username});

                db.collection("bookshelves").doc(user.uid).set({
                    read: [],
                    toRead: [], 
                    dnf: [],
                });

                return db.collection("user").doc(user.uid).set({
                    username: username,
                    goal: 0,
                    profileImg: "",
                });
            })
            .catch(error => alert(error.message))
    }

    const redirectToLogin = () => {
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView enabled={true} styles={styles.container}>
            <ImageBackground style={{ width: "100%", height: "100%", overflow: 'hidden' }}
                source={require("./../assets/images/Bookswall_generated.png")}>
                <View style={styles.header}
                >
                    <View style={{ paddingHorizontal: 10 }}><CustomText text={"Find your next favorite book!"} color={colors.white}
                        weight={"extra-bold"} size={30} align="center"
                        textShadowOffset={{ width: 2, height: 2 }}
                        textShadowRadius={20}
                        textShadowColor={"#131713"} /></View>
                </View>
                <View style={styles.footer}
                >
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
                                onChangeText={(text) => setEmail(text)}
                                style={[styles.input, { fontFamily: "Montserrat-Regular" }]}
                            />
                            <TextInput
                                placeholder="Username"
                                value={username}
                                onChangeText={(text) => setUsername(text)}
                                style={[styles.input, { fontFamily: "Montserrat-Regular" }]}
                            />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                style={[styles.input, { fontFamily: "Montserrat-Regular" }]}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                text={"Signup"}
                                onPress={handleSignUp}
                                weight={"bold"}
                                width={"100%"}
                            ></CustomButton>
                            <TouchableOpacity onPress={redirectToLogin}>
                                <View style={styles.login}>
                                    <CustomText text={"Login"} color={colors.primaryColor} weight="medium" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView >
    )
}

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
        flex: 5,
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
    login: {
        marginTop: 15,
    }
})

export default SignupScreen;