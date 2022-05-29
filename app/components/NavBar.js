import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import CustomText from './CustomText'

const NavBar = () => {
  return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            <View style={styles.icon}></View>
            <CustomText style={styles.iconText} text={"icon"}/>
        </View> 
        <View style={styles.iconContainer}>
            <View style={styles.icon}></View>
            <CustomText style={styles.iconText} text={"icon"}/>
        </View> 
        <View style={styles.iconContainer}>
            <View style={styles.icon}></View>
            <CustomText style={styles.iconText} text={"icon"}/>
        </View> 
        <View style={styles.iconContainer}>
            <View style={styles.icon}></View>
            <CustomText style={styles.iconText} text={"icon"}/>
        </View> 
    </View>
  )
}

export default NavBar

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "absolute",
        bottom: 0, 
        height: 120,
        backgroundColor: "white",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        backgroundColor: colors.primaryColor,
    },
    iconText: {
        marginTop: 10,
    }
})