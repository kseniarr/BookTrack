import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from './CustomText'
import Avatar from "./../components/Avatar"
import StarRating from './StarRating'
import { db } from '../../firebase';
import consts from '../config/consts'
import { useNavigation } from '@react-navigation/core';

const Review = ({ text, rating, uid, username }) => {
    const navigation = useNavigation();
    const [img, setImg] = useState();
    const [loaded, setLoaded] = useState(consts.loadingStates.INITIAL);

    useEffect(() => {
        setLoaded(consts.loadingStates.LOADING);
        const getImage = async () => {
            let response = await db.collection('user').doc(uid).get();
            setImg(response.data().profileImg);
            setLoaded(consts.loadingStates.SUCCESS);
        }
        getImage();
    }, [])
    return (
        loaded == consts.loadingStates.SUCCESS && <View style={{
            width: "90%",
            alignSelf: 'center',
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{
                flexDirection: 'row',
            }}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Profile", { uid: uid })
                }}>
                    <Avatar image={img} size={64} />
                </TouchableOpacity>
                <View style={{
                    marginHorizontal: 20,
                    height: 64,
                    justifyContent: 'center',
                }}>
                    <CustomText text={username} />
                    <StarRating rating={rating} />
                </View>
            </View>
            <View style={{
                paddingVertical: 20,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}><CustomText text={text} align={"left"} /></View>
        </View>
    )
}

export default Review

const styles = StyleSheet.create({

})