import { StyleSheet, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../config/colors'
import RemoteImage from "./../components/RemoteImage"

const Avatar = ({image}) => {
    return (
        <View style={styles.avatar}>
            {!image && <Ionicons name="person" style={{ fontSize: 100 }} color={colors.white}></Ionicons>}
            {image != null && image != undefined && <RemoteImage uri={image} desiredWidth={144} circle={true}/>}
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