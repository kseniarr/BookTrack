import { StyleSheet, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomText from "./../components/CustomText";
import { auth } from '../../firebase'
import CustomButton from '../components/CustomButton';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/core'
import consts from '../config/consts';
import UpdateImage from '../components/UpdateImage';
import AppStateContext from '../components/AppStateContext';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { context, setContext } = useContext(AppStateContext);

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
                setContext({});
            })
            .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: consts.bottomPadding }}>
                <UpdateImage image={""} />
                <View style={{ marginTop: 10, marginBottom: 20 }}><CustomText text={"Settings"} size={24} align="center" /></View>
                <View style={{
                    marginVertical: 15,
                }}>
                    <View><CustomText text={`username: ${context.username}`} size={14} /></View>
                    <View><CustomText text={`email: ${auth.currentUser?.email}`} size={14} /></View>
                </View>
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