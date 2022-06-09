import { StyleSheet } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import consts from '../config/consts'
import { TouchableOpacity } from 'react-native'
import CustomText from "./../components/CustomText"

const CustomButton = ({ text, onPress, border = false, label = "Button", size = 14, weight = "regular", width, backgroundColor = colors.primaryColor, align }) => {
    return (
        <TouchableOpacity 
                style={[styles.btn, {width: width, backgroundColor: backgroundColor}, 
                border == true && {
                    borderColor: colors.primaryColor,
                    borderWidth: 1,
                    borderRadius: consts.borderRadius * 4,
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                }]}
                activeOpacity={0.8}
                accessibilityLabel={label}
                onPress={onPress}>
                        <CustomText 
                                    text={text} 
                                    color={ backgroundColor == colors.primaryColor ? colors.white : colors.black} 
                                    size={size} 
                                    weight={weight}
                                    align={align}/>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    btn: {
        borderRadius: consts.borderRadius,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    text: {
        color: colors.white,
    }
})