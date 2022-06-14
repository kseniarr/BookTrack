import { StyleSheet, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../config/colors'
import RemoteImage from "./../components/RemoteImage"

const Avatar = ({ image, size = 144 }) => {
    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.grey,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {!image && <Ionicons name="person" style={{ fontSize: 100 }} color={colors.white}></Ionicons>}
            {image != null && image != undefined && <RemoteImage uri={image} desiredWidth={size} circle={true} />}
        </View>
    )
}

export default Avatar

const styles = StyleSheet.create({
})