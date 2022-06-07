import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../config/colors'


const Star = ({onPress, name}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Ionicons name={name} style={styles.star} color={colors.yellow}/>
    </TouchableOpacity>
  )
}

export default Star

const styles = StyleSheet.create({
    star: {
        fontSize: 20,
    }
})