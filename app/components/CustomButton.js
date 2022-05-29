import { StyleSheet } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import consts from '../config/consts'
import { TouchableOpacity } from 'react-native'
import CustomText from "./../components/CustomText"

const CustomButton = ({ text, onPress, label = "Button", size = 14, weight = "regular", width }) => {
    return (
        <TouchableOpacity 
                style={[styles.btn, {width: width}]}
                activeOpacity={0.5}
                accessibilityLabel={label}
                onPress={onPress}>
                        <CustomText 
                                    text={text} 
                                    color={colors.white} 
                                    size={size} 
                                    weight={weight}/>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    btn: {
        borderRadius: consts.borderRadius,
        backgroundColor: colors.primaryColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    text: {
        color: colors.white,
    }
})