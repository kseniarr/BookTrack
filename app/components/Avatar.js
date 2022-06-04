import { StyleSheet, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../config/colors'

const Avatar = () => {
    return (
        <View style={styles.avatar}>
            <Ionicons name="person" style={{ fontSize: 100 }} color={colors.white}></Ionicons>
        </View>
    )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        width: 144,
        height: 144, 
        borderRadius: 164/2,
        backgroundColor: colors.grey,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})