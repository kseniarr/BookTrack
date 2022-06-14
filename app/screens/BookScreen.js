import { StyleSheet, View, ScrollView, ImageBackground } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import RemoteImage from '../components/RemoteImage';
import CustomText from '../components/CustomText';
import colors from '../config/colors';
import consts from '../config/consts';
import AddToLibrary from '../components/AddToLibrary';
import Svg, { Path } from 'react-native-svg';
import { db, firebase } from '../../firebase';
import AddReview from '../components/AddReview';
import AppStateContext from '../components/AppStateContext';
import StarRating from '../components/StarRating';
import Review from '../components/Review';
import BackArrow from '../components/BackArrow';
import CustomButton from '../components/CustomButton';
import useRefresh from '../config/useRefresh';

const BookScreen = ({ route }) => {
    const { id } = route.params;
    const [coverURL, setCoverURL] = useState();
    const [bookTitle, setBookTitle] = useState();
    const [bookAuthors, setBookAuthors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rating, setRating] = useState(4.5);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [read, setRead] = useState(0);
    const [toRead, setToRead] = useState(0);
    const [dnf, setDnf] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [publishedDate, setPublishedDate] = useState("not stated");
    const [publisher, setPublisher] = useState("not stated");
    const [categories, setCategories] = useState(null);
    const [description, setDescription] = useState("No description provided");
    const [ISBN, setISBN] = useState("Not stated");
    const [shelf, setShelf] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const { context, setContext } = useContext(AppStateContext);
    const [userReview, setUserReview] = useState(null);
    const [reviews, setReviews] = useState();
    const { refresh, setRefresh } = useRefresh();

    let type = "id";

    // get reviews
    useEffect(() => {
        const getUserReview = async () => {
            let response = await db.collection('reviews').doc(id).get(context.uid);
            let data = response.data();
            if (data) setUserReview(data[context.uid]);
        }

        const getReviews = async () => {
            let response = await db.collection('reviews').doc(id).get();
            let reviewsArr = [];
            for (const [key, value] of Object.entries(response.data())) {
                if (key !== context.uid) {
                    let resp = await db.collection('bookshelves').doc(key).get();
                    let rating = 0;
                    resp.data().read.map((element) => {
                        if (element.id == id) rating = element.rating;
                    });


                    resp = await db.collection('user').doc(key).get();
                    let username = resp.data().username;
                    reviewsArr.push({
                        uid: key,
                        review: value,
                        rating: rating,
                        username: username,
                    })
                    setReviews(reviewsArr);
                }
            }
        }

        getUserReview();
        getReviews();
    }, [refresh])

    // set user shelf and rating
    useEffect(() => {
        const func = async () => {
            let response = await db.collection('bookshelves').doc(context.uid).get();
            let data = response.data();

            let readIds = data.read.map((element) => element.id);
            let toReadIds = data.toRead.map((element) => element.id);
            let dnfIds = data.dnf.map((element) => element.id);

            if (readIds.includes(id)) {
                setShelf("read");
                data.read.map((element) => {
                    if (element.id == id) setUserRating(element.rating)
                });
            }
            else if (toReadIds.includes(id)) setShelf("toRead");
            else if (dnfIds.includes(id)) setShelf("dnf");
        }

        func();
    }, [refresh])

    // other book data and loader
    useEffect(() => {
        const getCategories = (categories) => {
            let arr = [];
            for (let i = 0; i < categories.length; i++) {
                let tmp = categories[i].split(/&|,|\//);
                for (let j = 0; j < tmp.length; j++) {
                    arr.push(tmp[j].trim());
                }
            }
            setCategories(arr);
        }

        const getBookAuthors = (authors) => {
            if (authors.length > 1) {
                let authorsStr = "";
                for (let i = 0; i < authors.length; i++) {
                    if (i == authors.length - 1) {
                        authorsStr += authors[i];
                    } else {
                        authorsStr += authors[i] + ", ";
                    }
                }
                setBookAuthors(authorsStr);
            } else {
                setBookAuthors(authors[0]);
            }
        }

        const getReviews = async () => {
            let response = await db.collection("reviews").doc(id).get();
            if (response.data())
                setReviewsCount(Object.keys(response.data()).length);
        }

        let rating = 0;
        let numRatings = 0;

        const fromDB = async () => {
            const snapshot = await db.collection('bookshelves').get();
            let numRead = 0;
            let numToRead = 0;
            let numDnf = 0;

            snapshot.docs.map(doc => {
                let read = doc.data().read;
                let toRead = doc.data().toRead;
                let dnf = doc.data().dnf;
                for (let i = 0; i < read.length; i++) {
                    if (read[i].id == id) {
                        numRead++;
                        rating += read[i].rating;
                        if (read[i].rating != 0) {
                            numRatings += 1;
                        }
                    }
                }
                for (let i = 0; i < toRead.length; i++) {
                    if (toRead[i].id == id) {
                        numToRead++;
                    }
                }
                for (let i = 0; i < dnf.length; i++) {
                    if (dnf[i].id == id) {
                        numDnf++;
                    }
                }
                setRating(numRatings == 0 ? 0 : rating / numRatings);
                setRatingsCount(numRatings);
            });

            setRead(numRead);
            setToRead(numToRead);
            setDnf(numDnf);
        }

        const func = async () => {
            fromDB();
            let response = await fetch(`${consts.baseUrl}books/v1/volumes/${id}`, { method: "GET" });
            let json = await response.json();

            if (json.volumeInfo == undefined) {
                response = await fetch(`${consts.baseUrl}books/v1/volumes?q=isbn:${id}`, { method: "GET" });
                json = await response.json();
                type = "isbn"
            }

            if (type == "isbn") {
                setCoverURL(json.items[0].volumeInfo.imageLinks.thumbnail);
                setBookTitle(json.items[0].volumeInfo.title);
                getBookAuthors(json.items[0].volumeInfo.authors);

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
                    rating += json.items[0].volumeInfo.averageRating;
                    numRatings += json.items[0].volumeInfo.ratingsCount;
                }

                if (json.items[0].volumeInfo.categories) {
                    getCategories(json.items[0].volumeInfo.categories);
                }

                if (json.items[0].volumeInfo.description) {
                    setDescription(json.items[0].volumeInfo.description);
                }

                if (json.items[0].volumeInfo.averageRating) {
                    setRating((prev) => prev + json.items[0].volumeInfo.averageRating);
                }

                setISBN(id);

                setIsLoaded(true);
            }
            else if (type == "id") {
                if (json.volumeInfo.imageLinks.thumbnail) {
                    setCoverURL(json.volumeInfo.imageLinks.thumbnail);
                }
                else if (json.volumeInfo.imageLinks.smallThumbnail) {
                    setCoverURL(json.volumeInfo.imageLinks.smallThumbnail);
                }

                setBookTitle(json.volumeInfo.title);
                getBookAuthors(json.volumeInfo.authors);

                if (json.volumeInfo.pageCount) {
                    setPageCount(json.volumeInfo.pageCount);
                }

                if (json.volumeInfo.publishedDate) {
                    setPublishedDate(json.volumeInfo.publishedDate);
                }

                if (json.volumeInfo.publisher) {
                    setPublisher(json.volumeInfo.publisher);
                }

                if (json.volumeInfo.averageRating) {
                    rating += json.volumeInfo.averageRating;
                    numRatings += json.volumeInfo.ratingsCount;
                }

                if (json.volumeInfo.categories) {
                    getCategories(json.volumeInfo.categories);
                }

                if (json.volumeInfo.description) {
                    setDescription(json.volumeInfo.description);
                }

                if (json.volumeInfo.averageRating) {
                    setRating((prev) => prev + json.volumeInfo.averageRating);
                }

                setIsLoaded(true);
            }
        }

        getReviews();
        func();
    }, [refresh])



    return (
        isLoaded && <>
            <BackArrow />
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
                    <View style={{ backgroundColor: colors.secondaryColor, opacity: 0.25, width: "100%", height: "100%", position: 'absolute' }}></View>
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

                            <View style={{ marginTop: 5 }}>{bookAuthors == undefined ? <CustomText text={"authors not stated"} style={styles.authors} weight="medium"
                                size={16} align={"center"} color={colors.white}
                                textShadowOffset={{ width: 1, height: 1 }}
                                textShadowRadius={5} textShadowColor={"#2a302f"} /> :
                                <CustomText style={styles.authors} text={bookAuthors} weight="medium"
                                    size={16} align={"center"} color={colors.white}
                                    textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                            }</View>

                            <View style={styles.rating}>
                                <StarRating rating={rating} />
                                <CustomText text={ratingsCount + " ratings"} align={"center"} color={colors.white} weight="medium"
                                    size={16} textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                                <CustomText text={reviewsCount + " reviews"} align={"center"} color={colors.white} weight="medium"
                                    size={16} textShadowOffset={{ width: 1, height: 1 }}
                                    textShadowRadius={5} textShadowColor={"#2a302f"} />
                            </View>
                            {userRating != null && <CustomText text={`your rating: ${userRating}`} align={"center"} color={colors.white} weight="medium"
                                size={12} textShadowOffset={{ width: 1, height: 1 }}
                                textShadowRadius={5} textShadowColor={"#2a302f"} />}
                            {shelf != null && <CustomText text={`in shelf: ${shelf}`} align={"center"} color={colors.white} weight="medium"
                                size={12} textShadowOffset={{ width: 1, height: 1 }}
                                textShadowRadius={5} textShadowColor={"#2a302f"} />}
                            <View style={{ marginVertical: 10 }}><AddToLibrary align={"center"} bookId={id} /></View>

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
                                    <CustomText text={"ISBN: " + ISBN} color={colors.white}
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
                    <View style={{ marginBottom: 20 }}><CustomText text={`${reviewsCount} reviews`} align={"center"} /></View>
                    {(userReview == undefined || userReview == null) && <AddReview id={id} callback={() => setRefresh((prev) => prev + 1)} />}
                    {userReview != undefined && userReview != null &&
                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <CustomButton text={"Delete review"} width={140} onPress={async () => {
                                await db.collection("reviews").doc(id).update({
                                    [context.uid]: firebase.firestore.FieldValue.delete(),
                                });
                                setRefresh((prev) => prev + 1);
                            }} />
                        </View>}
                    {userReview != undefined && userReview != null &&
                        <Review
                            text={userReview}
                            rating={userRating}
                            uid={context.uid}
                            username={context.username} />}
                    <View>
                        {reviews != undefined && reviews != null && reviews.map((element) => {
                            return <Review style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                                key={element.uid}
                                text={element.review}
                                rating={element.rating}
                                uid={element.uid}
                                username={element.username} />
                        })}
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
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