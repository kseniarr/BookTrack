import { StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React from 'react'

const TabBar = ({ name, icon, color, onPress }) => {
    return (
        <TouchableOpacity style={{
            padding: 10,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
        }} onPress={onPress}>
            <Ionicons name={icon} color={color} style={{fontSize: 24}}/>
            <View style={{
                marginTop: 5,
                paddingBottom: 10,
            }}><CustomText text={name} align={"center"} size={10} color={color}/></View>
        </TouchableOpacity>
    )
}

export default TabBar

const styles = StyleSheet.create({})