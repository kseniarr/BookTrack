import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomText from '../components/CustomText'
import AppStateContext from '../components/AppStateContext';
import consts from '../config/consts';
import Avatar from '../components/Avatar';
import colors from '../config/colors';
import { db, firebase, auth } from '../../firebase'
import RemoteImage from "./../components/RemoteImage";
import { useNavigation } from '@react-navigation/core';
import Loader from '../components/Loader';
import YearlyGoal from '../components/YearlyGoal';
import Library from '../components/Library';
import useRefresh from '../config/useRefresh';
import BackArrow from '../components/BackArrow';

const ProfileScreen = ({ route }) => {
    const { uid } = route == undefined ? "" : route.params;
    const { context, setContext } = useContext(AppStateContext);
    const [read, setRead] = useState(0);
    const [toRead, setToRead] = useState(0);
    const [dnf, setDnf] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [books, setBooks] = useState(null);
    const [recentBooks, setRecentBooks] = useState(null);
    const [isLoaded, setIsLoaded] = useState(consts.loadingStates.INITIAL);
    const [userImg, setUserImg] = useState("");
    const { refresh, setRefresh } = useRefresh();

    const navigation = useNavigation();
    let snapshot = null;

    useEffect(() => {
        setRecentBooks(null);
        setIsLoaded(consts.loadingStates.LOADING);
        const func = async () => {
            let tmpSnap = await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).get();

            if (tmpSnap.data() == snapshot?.data()) return;
            else snapshot = tmpSnap;

            let numRead = snapshot.data().read.length;
            let numToRead = snapshot.data().toRead.length;
            let numDnf = snapshot.data().dnf.length;
            let numRatings = 0;
            let sumRatings = 0;

            setBooks(snapshot.data());
            let recent = null;
            let recentUrls = [];

            if (snapshot.data().read.length > 0) {
                if (snapshot.data().read.length <= 7) {
                    recent = snapshot.data().read;
                } else {
                    recent = snapshot.data().read.slice(-7);
                }

                recent.sort(function (x, y) {
                    return y.timestamp - x.timestamp;
                });

                for (let i = 0; i < recent.length; i++) {
                    let response = await fetch(`${consts.baseUrl}books/v1/volumes/${recent[i].id}`, { method: "GET" });
                    let json = await response.json();
                    let type = "id";

                    if (json.error) {
                        console.log(json.error.message);
                    } else {
                        if (json.volumeInfo == undefined) {
                            response = await fetch(`${consts.baseUrl}books/v1/volumes?q=isbn:${recent[i].id}`, { method: "GET" });
                            json = await response.json();
                            type = "isbn"
                        }

                        if (type == "id") {
                            if (json.volumeInfo.imageLinks.thumbnail) {
                                recentUrls.push({
                                    element: json.volumeInfo.imageLinks.thumbnail,
                                    id: recent[i].id
                                });
                            }
                            else if (json.volumeInfo.imageLinks.smallThumbnail) {
                                recentUrls.push({
                                    element: json.volumeInfo.imageLinks.smallThumbnail,
                                    id: recent[i].id
                                });
                            }
                        } else if (type == "isbn") {
                            recentUrls.push({
                                element: json.items[0].volumeInfo.imageLinks.thumbnail,
                                id: recent[i].id
                            });
                        }
                    }
                }
                setRecentBooks(recentUrls);
            }

            snapshot.data().read.map((element) => {
                if (element.rating > 0) {
                    numRatings++;
                    sumRatings += element.rating;
                }
            });

            setRead(numRead);
            setToRead(numToRead);
            setDnf(numDnf);
            setAvgRating(numRatings > 0 ? Math.round(sumRatings / numRatings * 100) / 100 : 0);
            setIsLoaded(consts.loadingStates.SUCCESS);
        }
        func();

    }, [snapshot, refresh]);

    useEffect(() => {
        const func = async () => {
            const data = await db.collection('user').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).get();
            setUserImg(data.data().profileImg);
        }

        func();
    }, [])

    const removeBook = async (shelf, id) => {
        const data = await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).get();
        let ind;
        data.data()[shelf].forEach((element, elementID) => {
            if (element.id == id) ind = elementID;
        })

        await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).update({ [shelf]: firebase.firestore.FieldValue.arrayRemove(data.data()[shelf][ind]) });
        setRefresh((prev) => prev + 1);
    }

    const updateRating = async (shelf, id, userRating) => {
        const data = await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).get();
        let ind;
        data.data().read.forEach((element, elementID) => {
            if (element.id == id) ind = elementID;
        })

        await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).update({ [shelf]: firebase.firestore.FieldValue.arrayRemove(data.data()[shelf][ind]) });
        await db.collection('bookshelves').doc(route == undefined || route == null ? auth.currentUser?.uid : uid).update({
            [shelf]: firebase.firestore.FieldValue.arrayUnion({
                id: data.data()[shelf][ind].id,
                timestamp: data.data()[shelf][ind].timestamp,
                rating: userRating,
            })
        });

        setRefresh((prev) => prev + 1);
    }

    return (
        <>
            {isLoaded == consts.loadingStates.LOADING && <View style={styles.loader}><Loader /></View>}
            {isLoaded == consts.loadingStates.SUCCESS && <View>
                {(uid != null || uid != undefined) && <BackArrow />}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.userData}>
                        <View style={styles.header}>
                            <Avatar image={userImg} />
                            <View style={{ marginVertical: 8 }}><CustomText text={`${context.username}`} weight={"bold"} size={24} align="center" /></View>
                        </View>
                        <View style={[styles.statictic, styles.alignLeft]}>
                            <CustomText text={"read: " + read} align="left" />
                            <CustomText text={"to read: " + toRead} />
                            <CustomText text={"dnf: " + dnf} />
                        </View>
                        <View style={[styles.statictic, styles.alignLeft]}>
                            <CustomText text={"average rating: " + avgRating} />
                        </View>
                    </View>
                    <View style={styles.userData}>
                        <CustomText text={"Recent books"} size={24} />
                        {recentBooks == null ? <View style={styles.recentBooks}><CustomText text="No books to show!" /></View> : <View style={styles.recentBooksContainer}>
                            <FlatList contentContainerStyle={styles.recentBooks}
                                data={recentBooks}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={(element) => {
                                    return <TouchableOpacity key={element.item.id + "recent"} activeOpacity={0.9} onPress={() => {
                                        navigation.navigate("Book", { id: element.item.id });
                                    }}>
                                        <View style={{ marginHorizontal: 5 }}>
                                            <RemoteImage desiredWidth={100} alignSelf={"center"} uri={element.item.element} />
                                        </View>
                                    </TouchableOpacity>
                                }}
                            />
                        </View>}
                    </View>
                    <View style={styles.userData}>
                        <YearlyGoal />
                    </View>
                    {books != null && <View style={styles.userData}>
                        <Library books={books}
                            removeBook={removeBook}
                            updateRating={updateRating}
                        />
                    </View>}
                </ScrollView>
            </View>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: consts.bottomPadding,
    },
    button: {
        padding: 15,
        marginTop: 20,
    },
    header: {
        marginTop: 20,
    },
    statictic: {
        width: "60%",
        marginVertical: 5,
        alignItems: 'center',
    },
    userData: {
        width: "100%",
        alignItems: 'center',
        marginBottom: 50,
    },
    alignLeft: {
        alignItems: "flex-start",
    },
    recentBooksContainer: {
        height: 163,
        width: "100%",
        borderBottomWidth: 5,
        borderBottomColor: colors.black,
        borderBottomEndRadius: consts.borderRadius,
        borderBottomStartRadius: consts.borderRadius,
        borderBottomLeftRadius: consts.borderRadius,
        borderBottomRightRadius: consts.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    recentBooks: {
        alignItems: 'baseline'
    },
    loader: {
        position: 'absolute',
        width: "100%",
        height: "100%",
    },
});

export default ProfileScreen;