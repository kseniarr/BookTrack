import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '../config/colors';
import CustomText from './CustomText';

const Progress = ({ done }) => {
    return (
        <View style={styles.progress}>
            <View style={{
                background: colors.primaryColor,
                borderRadius: 20,
                backgroundColor: colors.primaryColor,
                alignTtems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 1,
                width: done,
                height: 30,
            }}>
            
            </View>
            <View style={{
                height: 30,
                width: "100%",
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
            }}><CustomText text={`${done}`} align="center"/></View>
        </View>
    )
}

export default Progress

const styles = StyleSheet.create({
    progress: {
        backgroundColor: colors.grey,
        borderRadius: 20,
        position: "relative",
        marginVertical: 15,
        height: 30,
        width: 300,
        textAlign: 'center',
    },
})