import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Avatar from './Avatar'
import CustomButton from './CustomButton'
import * as ImagePicker from "expo-image-picker"
import { db, auth } from '../../firebase'
import AppStateContext from './AppStateContext'

const UpdateImage = ({ image }) => {
    const [selectedImage, setSelectedImage] = useState();
    const { context, setContext } = useContext(AppStateContext);

    useEffect(() => {
        const func = async () => {
            const data = await db.collection('user').doc(auth.currentUser?.uid).get();
            const img = data.data().profileImg;
            setSelectedImage(img);
        }

        func();
    },[])

    useEffect(() => {
        if (image) {
            setSelectedImage(image);
        }
    }, [image])

    const changeProfileImg = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.uri);
            await db.collection('user').doc(auth.currentUser?.uid).update({
                profileImg: result.uri,
            })
        }
    };

    const deleteProfileImg = async () => {
        setSelectedImage(null);
        await db.collection('user').doc(auth.currentUser?.uid).update({
            profileImg: "",
        })
    }

    return (
        <View style={styles.avatar}>
            <Avatar image={selectedImage} />
            <View style={styles.avatarBtns}>
                <CustomButton text={"Change avatar"} onPress={changeProfileImg} />
                <CustomButton text={"Delete avatar"} onPress={deleteProfileImg}/>
            </View>
        </View>
    )
}

export default UpdateImage

const styles = StyleSheet.create({
    avatar: {
        flexDirection: 'row',
        alignItems: 'center',
        maxHeight: 200,
        marginTop: 30,
    },
    avatarBtns: {
        height: "100%",
        justifyContent: 'space-evenly',
        paddingVertical: 40,
        paddingHorizontal: 10,
    },
})