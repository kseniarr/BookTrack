import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import consts from "../config/consts";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import { useState, useContext, useEffect } from "react";
import Modal from "react-native-modal"
import { db, firebase } from '../../firebase';
import AppStateContext from "./AppStateContext";
import StarRating from "./StarRating";
import useRefresh from "../config/useRefresh";

const AddToLibrary = ({ align, bookId }) => {
    const [showAddToLibrary, setShowAddToLibrary] = useState(false);
    const [activeBtn, setActiveBtn] = useState(null); // null - no active btns, 0 - "read", 1 - "to read", 2 - "dnf"
    const { context, setContext } = useContext(AppStateContext);
    const [totalStars, setTotalStars] = useState(0);
    const { refresh, setRefresh } = useRefresh();

    const showWindow = () => {
        showAddToLibrary ? setShowAddToLibrary(false) : setShowAddToLibrary(true);
    }

    const changeTotal = (total) => {
        setTotalStars(total);
    }

    useEffect(() => {
        setTotalStars(0);
    }, [activeBtn])

    const removeBook = async (shelf, id) => {
        const data = await db.collection('bookshelves').doc(context.uid).get();
        let ind;
        data.data()[shelf].forEach((element, elementID) => {
            if (element.id == id) ind = elementID;
        })

        await db.collection('bookshelves').doc(context.uid).update({ [shelf]: firebase.firestore.FieldValue.arrayRemove(data.data()[shelf][ind]) });
        setRefresh((prev) => prev + 1);
    }

    const AddToLibrary = async () => {
        let response = await db.collection("bookshelves").doc(context.uid).get();
        if (activeBtn == 0) {
            if ((response.data().read.map((element) => element.id).includes(bookId))) {
                await removeBook("read", bookId);
            }
            await db.collection("bookshelves").doc(context.uid).update({
                read: firebase.firestore.FieldValue.arrayUnion({
                    id: bookId,
                    timestamp: new Date(),
                    rating: totalStars,
                })
            });
        } else if (activeBtn = 1) {
            if ((await db.collection("bookshelves").doc(context.uid).get().data().toRead.map((element) => element.id).includes(bookId))) {
                await removeBook("toRead", bookId);
            }
            await db.collection("bookshelves").doc(context.uid).update({
                toRead: firebase.firestore.FieldValue.arrayUnion({
                    id: bookId,
                    timestamp: new Date(),
                })
            });
        } else if (activeBtn == 2) {
            if ((await db.collection("bookshelves").doc(context.uid).get().data().dnf.map((element) => element.id).includes(bookId))) {
                await removeBook("dnf", bookId);
            }
            await db.collection("bookshelves").doc(context.uid).update({
                dnf: firebase.firestore.FieldValue.arrayUnion({
                    id: bookId,
                    timestamp: new Date(),
                })
            });
        }

        setShowAddToLibrary(false);
    }

    return (
        <>
            <View >
                {showAddToLibrary && <Modal
                    isVisible={true}
                    onBackdropPress={() => setShowAddToLibrary(false)}
                    animationIn={"pulse"}
                    animationInTiming={300}
                    animationOutTiming={200}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ marginBottom: 10 }}><CustomText text={"Add to library"} weight={"medium"} size={20} /></View>
                            <View style={styles.options}>
                                <View style={[styles.option, { backgroundColor: activeBtn == 0 ? colors.white : "white" }]}>
                                    <CustomButton width={150} backgroundColor={activeBtn == 0 ? colors.white : "white"} text={"read"} onPress={() => activeBtn == 0 ? setActiveBtn(null) : setActiveBtn(0)} />
                                    {activeBtn == 0 && <View>
                                        <StarRating total={changeTotal} />
                                    </View>}
                                </View>
                                <View style={[styles.option, { backgroundColor: activeBtn == 1 ? colors.white : "white" }]}>
                                    <CustomButton width={150} backgroundColor={activeBtn == 1 ? colors.white : "white"} text={"to read"} onPress={() => activeBtn == 1 ? setActiveBtn(null) : setActiveBtn(1)} />
                                </View>
                                <View style={[styles.option, { backgroundColor: activeBtn == 2 ? colors.white : "white" }]}>
                                    <CustomButton width={150} backgroundColor={activeBtn == 2 ? colors.white : "white"} text={"dnf"} onPress={() => activeBtn == 2 ? setActiveBtn(null) : setActiveBtn(2)} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ marginRight: 10 }}><CustomButton text={"Add"} backgroundColor={activeBtn == null ? colors.grey : colors.primaryColor} onPress={() => {
                                    if (activeBtn !== null) {
                                        AddToLibrary();
                                    }
                                }} /></View>
                                <CustomButton text={"Close"} onPress={() => setShowAddToLibrary(false)} />
                            </View>
                        </View>
                    </View>
                </Modal>}
                <View style={{
                    alignSelf: align,
                }}>
                    <CustomButton
                        text={"Add to library"}
                        style={{ position: "relative" }}
                        weight={"medium"}
                        width={140}
                        size={12}
                        onPress={showWindow} />
                </View>
            </View>
        </>
    );
};

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
    options: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: "flex-start",
        alignSelf: "flex-start",
        width: "100%",
    },
    option: {
        paddingVertical: 5,
        width: "100%",
        borderRadius: consts.borderRadius,
    }
});

export default AddToLibrary;