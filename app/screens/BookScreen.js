import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/core';
import RemoteImage from '../components/RemoteImage';
import CustomText from '../components/CustomText';
import colors from '../config/colors';
import consts from '../config/consts';
import AddToLibrary from '../components/AddToLibrary';

const BookScreen = ({ route }) => {
    const navigation = useNavigation();
    const { isbn13 } = route.params;
    const [coverURL, setCoverURL] = useState();
    const [bookTitle, setBookTitle] = useState();
    const [bookAuthors, setBookAuthors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rating, setRating] = useState(4.5);
    const [ratingsCount, setRatingsCount] = useState(1);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [read, setRead] = useState(0);
    const [toRead, setToRead] = useState(0);
    const [dnf, setDnf] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [publishedDate, setPublishedDate] = useState("not stated");
    const [publisher, setPublisher] = useState("not stated");
    const [categories, setCategories] = useState(null);
    const [description, setDescription] = useState("No description provided");

    useEffect(() => {
        const func = async () => {
            const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn13, { method: "GET" })
            const json = await response.json();

            setCoverURL(json.items[0].volumeInfo.imageLinks.thumbnail);
            setBookTitle(json.items[0].volumeInfo.title);
            setBookAuthors(json.items[0].volumeInfo.authors);

            if (json.items[0].volumeInfo.pageCount) {
                setPageCount(json.items[0].volumeInfo.pageCount);
            }

            if (json.items[0].volumeInfo.publishedDate) {
                setPublishedDate(json.items[0].volumeInfo.publishedDate);
            }

            if (json.items[0].volumeInfo.publisher) {
                setPublisher(json.items[0].volumeInfo.publisher);
            }

            if (json.items[0].volumeInfo.averageRating) {
                setRating(json.items[0].volumeInfo.averageRating);
                setRatingsCount(json.items[0].volumeInfo.ratingsCount);
            }

            if (json.items[0].volumeInfo.categories) {
                setCategories(json.items[0].volumeInfo.categories);
            }

            if(json.items[0].volumeInfo.description) {
                setDescription(json.items[0].volumeInfo.description);
            }

            setIsLoaded(true);
        }

        func();
    }, [])

    return (
        isLoaded && <View style={styles.container}>
            <TouchableOpacity style={styles.arrow} activeOpacity={0.7} onPress={() => navigation.goBack()}>
                <Ionicons name={"arrow-back-outline"} style={{ fontSize: 24 }}></Ionicons>
                <View style={{ justifyContent: 'center' }}>
                    <CustomText text={"Back to home"} />
                </View>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ flexGrow: 1, width: "100%", paddingTop: 10, paddingBottom: 60, paddingHorizontal: 40, }} showsVerticalScrollIndicator={false}>
                <RemoteImage style={styles.image} uri={coverURL} desiredWidth={180} alignSelf={"center"}></RemoteImage>
                <View style={[styles.innerView, styles.header]} >
                    <CustomText
                        text={bookTitle}
                        weight="bold"
                        size={26}
                        align={"center"}
                    ></CustomText>

                    {bookAuthors.map((element, id) => {
                        return <CustomText key={id} style={styles.authors} text={element} size={16} align={"center"} />
                    })}

                    <View style={styles.rating}>
                        <CustomText text={rating} align={"center"} />
                        <CustomText text={ratingsCount + " ratings"} align={"center"} />
                        <CustomText text={reviewsCount + " reviews"} align={"center"} />
                    </View>

                    <AddToLibrary align={"center"}/>

                    <View style={styles.statistics}>
                        <View style={styles.statictic}>
                            <CustomText text={"read: " + read} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"to read: " + toRead} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"dnf'ed: " + dnf} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"page count: " + pageCount} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"date published: " + publishedDate} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"ISBN: " + isbn13} />
                        </View>
                        <View style={styles.statictic}>
                            <CustomText text={"publisher: " + publisher} />
                        </View>
                    </View>
                    <View style={styles.categories}>
                        {categories?.map(element => <View key={element} style={styles.category}>
                            <CustomText text={element} />
                        </View>)}
                    </View>
                </View>
                <View style={styles.description}>
                        <View style={{marginVertical: 10}}><CustomText text={"Description"} size={24} align={"center"} /></View>
                        <CustomText text={description} align={"justify"} lineHeight={20}/>
                    </View>
                    <View style={styles.reviews}>
                        <View style={{marginVertical: 10}}><CustomText text={"Reviews"} size={24} align={"center"} /></View>
                        <CustomText text={reviewsCount ? "reviews" : "0 reviews"} align={"center"}/>
                    </View>
            </ScrollView>
        </View>
    )
}

export default BookScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    arrow: {
        flexDirection: 'row',
        padding: 15,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    image: {

    },
    header: {
        marginTop: 15,
    },
    rating: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "space-around",
        marginVertical: 10,
        alignSelf: 'center',
    },
    actions: {
        marginVertical: 5,
        alignSelf: 'center',
    },
    statistics: {
        padding: 10,
    },
    statictic: {
        paddingBottom: 5,
    },
    categories: {
        marginVertical: 20,
    },
    category: {
        backgroundColor: colors.grey,
        borderRadius: consts.borderRadius * 2,
        paddingHorizontal: 15,
        paddingVertical: 7,
        alignSelf: 'center',
    },
    description: {
        width: "100%",
    }
})