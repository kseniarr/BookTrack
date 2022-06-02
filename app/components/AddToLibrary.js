import { StyleSheet, View } from "react-native";
import colors from "../config/colors";
import consts from "../config/consts";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import { useState } from "react";
import Modal from "react-native-modal"

const AddToLibrary = ({align}) => {
    const [showAddToLibrary, setAddToLibrary] = useState(false);

    const showWindow = () => {
        showAddToLibrary ? setAddToLibrary(false) : setAddToLibrary(true);
    }

    return (
        <>
            <View >
                {showAddToLibrary && <Modal
                    isVisible={true}
                    onBackdropPress={() => setAddToLibrary(false)}
                    animationIn={"pulse"}
                    animationInTiming={300}
                    animationOutTiming={200}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <CustomText text={"Add to library"} weight={"medium"} size={20} />
                            <View style={styles.options}>
                                <View style={styles.option}>
                                    <CustomButton backgroundColor={"white"} text={"read"} onPress={() => console.log("read")} />
                                </View>
                                <View style={styles.option}>
                                    <CustomButton backgroundColor={"white"} text={"to read"} onPress={() => console.log("to read")} />
                                </View>
                                <View style={styles.option}>
                                    <CustomButton backgroundColor={"white"} text={"dnf"} onPress={() => console.log("dnf")} />
                                </View>
                            </View>
                            <CustomButton text={"Close"} onPress={() => setAddToLibrary(false)} />
                        </View>
                    </View>
                </Modal>}
                <View style={{
                    alignSelf: align,
                    backgroundColor: colors.white,
                }}>
                    <CustomButton
                        text={"Add to library"}
                        style={[styles.btn, { position: "relative" }]}
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
    },
    options: {
        marginTop: 20,
        marginBottom: 30,
        alignItems: "flex-start",
        alignSelf: "flex-start",
    },
    option: {
        paddingVertical: 5,
    }
});

export default AddToLibrary;