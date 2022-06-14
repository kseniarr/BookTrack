import { StyleSheet, View, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import CustomButton from './CustomButton'
import Modal from "react-native-modal"
import consts from '../config/consts'
import colors from '../config/colors'
import CustomText from './CustomText'
import AppStateContext from './AppStateContext'
import { db } from '../../firebase'

const AddReview = ({ id, callback }) => {
    const [showModal, setShowModal] = useState(false);
    const { context, setContext } = useContext(AppStateContext);
    const [review, setReview] = useState('');

    const addReview = async () => {
        if (review.trim() !== "") {
            await db.collection('reviews').doc(id).update({
                [context.uid]: review,
            })
            setShowModal(false);
            callback();
        }
    }

    return (
        <>
            {showModal && <Modal
                isVisible={true}
                onBackdropPress={() => setShowModal(false)}
                animationIn={"pulse"}
                animationInTiming={300}
                animationOutTiming={200}>
                <View style={styles.centeredDiv}>
                    <View style={styles.modalView}>
                        <View style={{ marginBottom: 10 }}><CustomText text={"Write review"} weight={"medium"} size={20} /></View>
                        <TextInput style={{
                            borderWidth: 1,
                            borderColor: colors.grey,
                            borderRadius: consts.borderRadius,
                            width: 200,
                            height: 200,
                        }}
                            placeholder="Share your thoughts!"
                            value={review}
                            onChangeText={(text) => setReview(text)} />
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={{ marginRight: 10 }}><CustomButton text="submit" onPress={addReview} /></View>
                            <CustomButton text="close" onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <CustomButton text={"Add review"} width={140} onPress={setShowModal} />
            </View>
        </>
    )
}

export default AddReview

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    modalView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: consts.borderRadius * 5,
        paddingVertical: 35,
        paddingHorizontal: 50,
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        zIndex: 100,
    },
})