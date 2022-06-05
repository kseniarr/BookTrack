import { StyleSheet, Text } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const CustomText = ({ text, size = 14, color = colors.black, 
                      weight = "regular", onPress, align,
                      lineHeight,
                      textShadowOffset, 
                      textShadowRadius,
                      textShadowColor,
                      numberOfLines, }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Text numberOfLines={numberOfLines}
            style={{
                fontSize: size, 
                color: color,
                textAlign: align,
                lineHeight: lineHeight,
                fontFamily: weight == "bold" ? "Montserrat-Bold" : 
                            weight == "extra-bold" ? "Montserrat-ExtraBold" :
                            weight == "semi-bold" ? "Montserrat-SemiBold" :
                            weight == "italic" ? "Montserrat-Italic" : 
                            weight == "medium" ? "Montserrat-Medium" : "Montserrat-Regular",
                            textShadowOffset: textShadowOffset,
                            textShadowRadius: textShadowRadius,
                            textShadowColor: textShadowColor,
                }}>{text}</Text>
        </TouchableWithoutFeedback>
    )
}

export default CustomText

const styles = StyleSheet.create({
})