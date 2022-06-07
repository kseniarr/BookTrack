import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import CustomText from '../components/CustomText'
import AppStateContext from '../components/AppStateContext';
import CustomButton from '../components/CustomButton';
import consts from '../config/consts';
import Avatar from '../components/Avatar';
import colors from '../config/colors';
import { db } from '../../firebase'
import RemoteImage from "./../components/RemoteImage";
import { useNavigation } from '@react-navigation/core';

const ProfileScreen = () => {
    const { context, setContext } = useContext(AppStateContext);
    const [read, setRead] = useState(0);
    const [toRead, setToRead] = useState(0);
    const [dnf, setDnf] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const [books, setBooks] = useState(null);
    const [recentBooks, setRecentBooks] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [yearlyGoal, setYearlyGoal] = useState(null);

    const navigation = useNavigation();

    const changeYearlyGoal = () => {

    }

    useEffect(() => {
        setRecentBooks(null);
        const func = async () => {
            const snapshot = await db.collection('bookshelves').doc(context.uid).get();
            let numRead = snapshot.data().read.length;
            let numToRead = snapshot.data().toRead.length;
            let numDnf = snapshot.data().dnf.length;
            let reviews = [];
            let numRatings = 0;
            let sumRatings = 0;

            setBooks(snapshot.data().read);
            let recent = null;
            let recentUrls = [];

            if (snapshot.data().read.length > 0) {
                if (snapshot.data().read.length <= 7) {
                    recent = snapshot.data().read;
                } else {
                    recent = snapshot.data().read.slice(-7);
                }

                recent.reverse();

                for (let i = 0; i < recent.length; i++) {
                    let response = await fetch(`${consts.baseUrl}books/v1/volumes/${recent[i].id}`, { method: "GET" });
                    let json = await response.json();
                    let type = "id";

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
                setRecentBooks(recentUrls);
            }

            snapshot.data().read.map((element) => {
                if (element.review && element.review != "") {
                    reviews.push({
                        id: element.id,
                        rating: element.rating,
                        review: element.review,
                    });
                }

                if (element.rating > 0) {
                    numRatings++;
                    sumRatings += element.rating;
                }
            });

            setRead(numRead);
            setToRead(numToRead);
            setDnf(numDnf);
            setReviews(reviews);
            setAvgRating(numRatings > 0 ? Math.round(sumRatings / numRatings * 100) / 100 : 0);
        }

        func();

    }, []);

    return (
        <View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.userData}>
                    <View style={styles.header}>
                        <Avatar />
                        <View style={{ marginVertical: 8 }}><CustomText text={`${context.username}`} weight={"bold"} size={24} align="center" /></View>
                    </View>
                    <View style={[styles.statictic, styles.alignLeft]}>
                        <CustomText text={"read: " + read} align="left" />
                        <CustomText text={"to read: " + toRead} />
                        <CustomText text={"dnf: " + dnf} />
                    </View>
                    <View style={[styles.statictic, styles.alignLeft]}>
                        <CustomText text={"average rating: " + avgRating} />
                        <CustomText text={"number of reviews: " + (reviews == null ? 0 : reviews.length)} />
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
                                console.log(element);
                                return <TouchableOpacity key={element.item.id} activeOpacity={0.9} onPress={() => {
                                    navigation.navigate("Book", {id: element.item.id});
                                }}>
                                    <View style={{marginHorizontal: 5}}>
                                        <RemoteImage desiredWidth={100} alignSelf={"center"} uri={element.item.element} />
                                    </View>
                                </TouchableOpacity>

                            }}
                        />
                    </View>}
                </View>
                <View style={styles.userData}>
                    <CustomText text={"Yearly goal"} size={24} />
                    {yearlyGoal == null ? <View>
                        <View style={{ marginVertical: 10 }}><CustomText text={"No yearly goal set"} align="center" /></View>
                        <CustomButton text={"Set yearly goal"} onPress={changeYearlyGoal} />
                    </View> : <View>
                        <CustomText text={"yearly goal"} />
                    </View>}
                </View>
                {books != null && <View style={styles.userData}>
                </View>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        height: 165,
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
    }
});

export default ProfileScreen;