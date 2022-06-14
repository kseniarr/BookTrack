import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/core';
import React from 'react'

const BackArrow = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.topContainer}>
            <TouchableOpacity style={styles.arrow} activeOpacity={0.7} onPress={() => navigation.goBack()}>
                <Ionicons name={"arrow-back-outline"} style={{ fontSize: 24 }}></Ionicons>
            </TouchableOpacity>
        </View>
    )
}

export default BackArrow

const styles = StyleSheet.create({
    topContainer: {
        position: 'absolute',
        zIndex: 1,
    },
    arrow: {
        flexDirection: 'row',
        padding: 15,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
})