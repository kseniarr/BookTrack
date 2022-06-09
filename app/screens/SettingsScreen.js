import { StyleSheet, View, ScrollView } from 'react-native'
import React from 'react'
import CustomText from "./../components/CustomText";
import { auth } from '../../firebase'
import CustomButton from '../components/CustomButton';
import colors from '../config/colors';
import Avatar from '../components/Avatar';
import { useNavigation } from '@react-navigation/core'
import consts from '../config/consts';

const SettingsScreen = () => {

    const navigation = useNavigation();

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: consts.bottomPadding }}>
                <View style={styles.avatar}>
                    <Avatar />
                    <View style={styles.avatarBtns}>
                        <CustomButton text={"Change avatar"} />
                        <CustomButton text={"Delete avatar"} />
                    </View>
                </View>
                <View style={{ marginTop: 10, marginBottom: 20 }}><CustomText text={"Settings"} size={24} align="center" /></View>
                <View style={{ marginTop: 20 }}><CustomButton customStyle={styles.button} onPress={handleSignOut}
                    text={"Sign out"} color={colors.white} weight="bold" size={16} /></View>
            </ScrollView>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    avatar: {
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight: 200,
        marginTop: 30,
    },
    avatarBtns: {
        height: "100%",
        justifyContent: 'space-evenly',
        paddingVertical: 40,
        paddingHorizontal: 10,
    },
    input: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: consts.borderRadius,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 10,
    },
    inputContainer: {
        width: "80%",
        marginBottom: 10,
    },
})