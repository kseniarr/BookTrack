import { StyleSheet, Image } from 'react-native'
import React from 'react'

const RemoteImage = ({uri, desiredWidth}) => {
    const [desiredHeight, setDesiredHeight] = React.useState(0)

    Image.getSize(uri, (width, height) => {
        setDesiredHeight(desiredWidth / width * height)
    })

    return (
        <Image
            source={{uri}}
            style={{
                borderWidth: 1,
                width: desiredWidth,
                height: desiredHeight
            }}
        />
    )
}

export default RemoteImage

const styles = StyleSheet.create({})