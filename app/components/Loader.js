import { StyleSheet, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Loader = () => {
  return (
    <View style={styles.container} >
      <LottieView speed={1} renderMode={"SOFTWARE"} source={require("./../assets/loader.json")} autoPlay={true} loop={true}/>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        top: 0, 
        left: "22%", 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        maxWidth: 200,
        zIndex: 100,
    }
})