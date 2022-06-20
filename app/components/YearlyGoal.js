import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import AppStateContext from './AppStateContext';
import { db, auth } from '../../firebase';
import consts from '../config/consts';
import CustomText from './CustomText';
import colors from '../config/colors';
import CustomButton from './CustomButton';
import Modal from "react-native-modal"
import Ionicons from 'react-native-vector-icons/Ionicons'
import Progress from './Progress';

const YearlyGoal = () => {
    const [showModal, setShowModal] = useState(false);
    const [goal, setGoal] = useState(0);
    const [read, setRead] = useState(0);
    const { context, setContext } = useContext(AppStateContext);
    const [isLoaded, setIsLoaded] = useState(consts.loadingStates.INITIAL);
    const [changedGoal, setChangedGoal] = useState(0);

    useEffect(() => {
        setIsLoaded(consts.loadingStates.LOADING);
        const getGoal = async () => {
            let snapshot = await db.collection('user').doc(auth.currentUser?.uid).get();
            let currYear = new Date().getFullYear();

            if (snapshot.data()["goal" + currYear]) {
                setGoal(snapshot.data()["goal" + currYear]);
            }
        }

        const getRead = async () => {
            let snapshot = await db.collection("bookshelves").doc(auth.currentUser?.uid).get();
            setRead(snapshot.data().read.length);
            setIsLoaded(consts.loadingStates.SUCCESS);
        }

        getGoal();
        getRead();
    }, [])

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <CustomText text={`${new Date().getFullYear()} goal`} size={24} />
                <TouchableOpacity activeOpacity={0.7} onPress={setShowModal} style={{ marginHorizontal: 10 }}>
                    <Ionicons name="create-outline" style={{ fontSize: 20 }} />
                </TouchableOpacity>
            </View>

            {goal == 0 && isLoaded == consts.loadingStates.SUCCESS && <View>
                <View style={{ marginVertical: 10 }}><CustomText text="no yearly goal set!" align={"center"} /></View>
            </View>}
            {goal != 0 && isLoaded == consts.loadingStates.SUCCESS && 
                <View>
                    <View style={{marginVertical: 5}}><CustomText text={`${read}/${goal} books read`} align="center" /></View>
                    <Progress done={Math.round(read / goal * 100) + "%"}/>
                </View>
            } 
            {showModal && <Modal
                isVisible={true}
                onBackdropPress={() => setShowModal(false)}
                animationIn={"pulse"}
                animationInTiming={300}
                animationOutTiming={200}>
                <View style={styles.centeredDiv}>
                    <View style={styles.modalView}>
                        <View style={{ marginBottom: 10 }}><CustomText text={"Установить цель"} weight={"medium"} size={20} /></View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='new yearly goal'
                                style={[styles.input,
                                { fontFamily: "Montserrat-Regular" }
                                ]}
                                value={changedGoal.toString()}
                                onChangeText={(text) => {
                                    setChangedGoal(text);
                                }}
                            ></TextInput>
                            <CustomButton text="submit" onPress={async () => {
                                setShowModal(false);
                                setGoal(changedGoal);
                                await db.collection("user").doc(auth.currentUser?.uid).update({
                                    ["goal" + new Date().getFullYear()]: changedGoal
                                });
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>}
        </View>
    )
}

export default YearlyGoal

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
        backgroundColor: colors.white,
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
    input: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: consts.borderRadius,
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 10,
    },
    inputContainer: {
        width: "80%",
        marginBottom: 10,
    },
    progress: {
        height: 20,
        backgroundColor: colors.grey,
        borderRadius: 20,
        overflow: 'hidden'
    },
    innerView: {
        height: 20,
        width: "100%",
        borderRadius: 20,
        backgroundColor: colors.primaryColor,
        position: 'absolute',
        left: 0,
        right: 0,
    },
})