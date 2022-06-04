import { StyleSheet, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/core';
import RemoteImage from '../components/RemoteImage';
import CustomText from '../components/CustomText';
import colors from '../config/colors';
import consts from '../config/consts';
import AddToLibrary from '../components/AddToLibrary';
import Svg, { Path } from 'react-native-svg';
import CustomButton from '../components/CustomButton';

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

            if (json.items[0].volumeInfo.description) {
                setDescription(json.items[0].volumeInfo.description);
            }

            setIsLoaded(true);
        }

        func();
    }, [])

    return (
        isLoaded && <>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.arrow} activeOpacity={0.7} onPress={() => navigation.goBack()}>
                    <Ionicons name={"arrow-back-outline"} style={{ fontSize: 24 }}></Ionicons>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={
                styles.container
            } showsVerticalScrollIndicator={false}>
                <ImageBackground imageStyle={{ width: "100%", opacity: 1, resizeMode: 'cover' }} blurRadius={7}
                    source={{ uri: coverURL }} style={{ position: 'relative', zIndex: 2 }}>
                    <View style={{ height: 80, width: "100%", position: 'absolute', bottom: -24, zIndex: 3 }}>
                        <Svg viewBox="0 0 1440 320">
                            <Path fill={colors.white} fill-opacity="1"
                                d="M0,192L60,202.7C120,213,240,235,360,218.7C480,203,600,149,720,128C840,107,960,117,1080,128C1200,139,1320,149,1380,154.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
                            </Path>
                        </Svg>
                    </View>
                    <View style={{ backgroundColor: "#0d241f", opacity: 0.25, width: "100%", height: "100%", position: 'absolute' }}></View>
                    <View style={[styles.padding]}>
                        <View style={styles.image}><RemoteImage uri={coverURL} desiredWidth={180} alignSelf={"center"}></RemoteImage></View>
                        <View style={[styles.innerView, styles.header]} >
                            <CustomText
                                text={bookTitle}
                                weight="bold"
                                size={bookTitle.length > 50 ? 16 : 24}
                                align={"center"}
                                color={colors.white}
                                textShadowOffset={{ width: 2, height: 2 }}
                                textShadowRadius={10}
                                textShadowColor={"#2a302f"}
                            ></CustomText>

                            <View style={{ marginTop: 5 }}>{bookAuthors.map((element, id) => {
                                return <CustomText key={id} style={styles.authors} text={element} weight="medium"
                                    size={16} align={"center"} color={colors.white}
                                    textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                            })}</View>

                            <View style={styles.rating}>
                                <CustomText text={rating} align={"center"} color={colors.white} weight="medium"
                                    size={16} textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                                <CustomText text={ratingsCount + " ratings"} align={"center"} color={colors.white} weight="medium"
                                    size={16} textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                                <CustomText text={reviewsCount + " reviews"} align={"center"} color={colors.white} weight="medium"
                                    size={16} textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                            </View>

                            <View style={{ marginVertical: 10 }}><AddToLibrary align={"center"} /></View>

                            <View style={styles.statistics}>
                                <View style={styles.statictic}>
                                    <CustomText text={"read: " + read} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"to read: " + toRead} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"dnf'ed: " + dnf} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"page count: " + pageCount} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"date published: " + publishedDate} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"ISBN: " + isbn13} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#161a19"} />
                                </View>
                                <View style={styles.statictic}>
                                    <CustomText text={"publisher: " + publisher} color={colors.white}
                                        textShadowOffset={{ width: 1, height: 1 }}
                                        textShadowRadius={5} textShadowColor={"#2a302f"} />
                                </View>
                            </View>
                            <View style={styles.categories}>
                                {categories?.map(element => <View key={element} style={styles.category}>
                                    <CustomText text={element} />
                                </View>)}
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.description}>
                    <View style={{ marginVertical: 10 }}><CustomText text={"Description"} size={24} align={"center"} /></View>
                    <CustomText text={description} align={"justify"} lineHeight={20} />
                </View>
                <View style={styles.reviews}>
                    <View style={{ marginVertical: 10 }}><CustomText text={"Reviews"} size={24} align={"center"} /></View>
                    <CustomText text={reviewsCount ? "reviews" : "0 reviews"} align={"center"} />
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <CustomButton text={"Add review"} width={140} />
                    </View>
                </View>
            </ScrollView>
        </>)
}

export default BookScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: colors.white,
    },
    topContainer: {
        position: 'absolute',
        zIndex: 1,
    },
    arrow: {
        flexDirection: 'row',
        padding: 15,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    image: {
        paddingTop: 20,
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
        backgroundColor: colors.white,
        borderRadius: consts.borderRadius * 2,
        paddingHorizontal: 15,
        paddingVertical: 7,
        alignSelf: 'center',
        opacity: 0.9,
    },
    padding: {
        paddingTop: 10,
        paddingBottom: consts.bottomPadding,
        paddingHorizontal: 30,
    },
    description: {
        width: "100%",
        marginTop: 50,
        paddingHorizontal: 30,
    },
    reviews: {
        paddingBottom: consts.bottomPadding,
        marginTop: 50,
    }
})