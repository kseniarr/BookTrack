import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native'
import BookResult from '../components/BookResult'
import consts from '../config/consts'
import colors from '../config/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'

const HomeScreen = () => {
    const nytApiKey = "FFfJWvHZLXNGlVX8SRPICahCCtedaJT2";
    const [popularBooks, setPopularBooks] = useState(null);
    const [popularISBNS, setPopularISBNS] = useState(null);
    const [isbns, setIsbns] = useState(null);
    const [input, setInput] = useState("");
    const [header, setHeader] = useState("Popular Books");
    const [isInputSet, setIsInputSet] = useState(false);

    useEffect(() => {
        fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=' + nytApiKey,
            { method: 'get', })
            .then(response => { return response.json(); })
            .then(json => {
                setPopularBooks(json)
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const loadData = () => {
            if (popularISBNS == null && popularBooks !== null) {
                setPopularISBNS(popularBooks?.results.map(element => {
                    return { element: element.book_details[0].primary_isbn13 }
                }));
            }
        }

        loadData();
        setIsInputSet(false);
    }, [popularBooks])

    const handleSubmit = async () => {
        const loadData = async () => {
            let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${input}`,
                { method: "GET" }).then(response => response.json());

            setIsbns(response?.items?.filter((element) => {
                if (element.volumeInfo.imageLinks == undefined || (
                    !element.volumeInfo.industryIdentifiers[0].type.includes("ISBN")
                    || !element.volumeInfo.industryIdentifiers[1].type.includes("ISBN"))) return false;
                else return true;
            }).map(element => {
                let isbn = element.volumeInfo.industryIdentifiers[1]?.identifier;
                if (isbn == undefined) {
                    isbn = element.volumeInfo.industryIdentifiers[0]?.identifier
                }

                return {
                    element: isbn
                }
            }));
        }

        loadData();
        setHeader(input);
        setIsInputSet(true);
    }
    
    return (
        <View style={styles.container}>
            <View>
                <StatusBar></StatusBar>
                <SafeAreaView style={styles.searchContainer}>
                    <View style={styles.searchBarContainer}>
                        <View style={styles.search}>
                            <Ionicons
                                style={styles.icon}
                                name={"search-outline"}></Ionicons>
                        </View>
                        <TextInput
                            placeholder='Enter a book title!'
                            style={[styles.inputContainer,
                            { fontFamily: "Montserrat-Regular" }
                            ]}
                            onChangeText={(text) => setInput(text)}
                            onSubmitEditing={handleSubmit}
                            value={input}
                        ></TextInput>
                        <View style={styles.clear}>
                            <Ionicons
                                onPress={() => {
                                    setInput("");
                                    console.log("onClick");
                                    setIsInputSet(false);
                                    setHeader("Popular Books");
                                }}
                                style={[styles.icon, styles.clearIcon]}
                                name={"close-outline"}
                            ></Ionicons>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            <BookResult text={header} data={isInputSet ? isbns : popularISBNS}></BookResult>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: colors.primaryColor,
        width: '60%',
        padding: 15,
        borderRadius: consts.borderRadius,
        alignItems: 'center',
        marginTop: 40,
    },
    searchContainer: {
        marginBottom: 20,
        width: "100%",
        alignItems: 'center',
    },
    searchBarContainer:
    {
        backgroundColor: 'white',
        width: '100%',
        height: 45,
        flexDirection: 'row',
        padding: 10,
        borderRadius: consts.borderRadius,
    },
    clear: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: "white",
        flex: 1,
    },
    search: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        color: colors.grey,
    },
    clearIcon: {
        fontSize: 25,
    }
});

export default HomeScreen;
