import { StyleSheet, Image } from 'react-native'
import React from 'react'

const RemoteImage = ({ uri, desiredWidth, alignSelf, circle = false }) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0)

    Image.getSize(uri, (width, height) => {
        setDesiredHeight(desiredWidth / width * height)
    })

    return (
        <Image
            resizeMethod='scale'
            source={{ uri: uri }}
            defaultSource={require("./../assets/images/image-default.jpg")}
            style={{
                borderWidth: 1,
                width: desiredWidth,
                height: desiredHeight,
                alignSelf: alignSelf,
                borderRadius: circle ? desiredWidth / 2 : 0,
            }}
        />
    )
}

export default RemoteImage

const styles = StyleSheet.create({})