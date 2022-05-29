import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/core'
import { auth } from '../../firebase'
import CustomText from '../components/CustomText'
import AppStateContext from '../components/AppStateContext';
import colors from '../config/colors'
import CustomButton from '../components/CustomButton'

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { context, setContext } = useContext(AppStateContext);
    console.log("context: " + context);

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
            <CustomText text={`Email: ${auth.currentUser?.email}`} />
            <CustomText text={`Username: ${context}`} />
            <CustomButton customStyle={styles.button} onPress={handleSignOut}
                text={"Sign out"} color={colors.white} weight="bold" size={16} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        padding: 15,
        marginTop: 20,
    }
});

export default ProfileScreen;