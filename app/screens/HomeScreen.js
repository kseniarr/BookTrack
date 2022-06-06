import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native'
import BookResult from '../components/BookResult'
import consts from '../config/consts'
import colors from '../config/colors'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler'
import Loader from '../components/Loader'

const HomeScreen = () => {
    const [popularBooks, setPopularBooks] = useState(null);
    const [popularISBNS, setPopularISBNS] = useState([{ element: "9780141036144" }]);
    const [isbns, setIsbns] = useState(null);
    const [input, setInput] = useState("");
    const [header, setHeader] = useState("Popular Books");
    const [isInputSet, setIsInputSet] = useState(false);
    const [loadingState, setLoadingState] = useState(consts.loadingStates.INITIAL);

    // ----------   TEMPORARY COMMENTED OUT  ----------

    // useEffect(() => {
    //     fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=' + consts.nytApiKey,
    //         { method: 'get', })
    //         .then(response => { return response.json(); })
    //         .then(json => {
    //             setPopularBooks(json)
    //         })
    //         .catch(err => console.log(err));
    // }, []);

    // useEffect(() => {
    //     const loadData = () => {
    //         if (popularISBNS == null && popularBooks !== null) {
    //             setPopularISBNS(popularBooks?.results.map(element => {
    //                 return { element: element.book_details[0].primary_isbn13 }
    //             }));
    //         }
    //     }

    //     loadData();
    //     setIsInputSet(false);
    // }, [popularBooks])

    // ----------   TEMPORARY COMMENTED OUT  ----------

    let descriptionsId = [];

    const handleSubmit = async () => {
        setIsbns(null);
        setLoadingState(consts.loadingStates.LOADING);

        const checkIfDescription = async (id) => {
            let type = "id";
            let response = await fetch(`${consts.baseUrl}books/v1/volumes/${id}`, { method: "GET" });
            let json = await response.json();

            if (json.volumeInfo == undefined) {
                response = await fetch(`${consts.baseUrl}books/v1/volumes?q=isbn:${id}`, { method: "GET" });
                json = await response.json();
                type = "isbn"
            }

            if (type == "isbn") {
                let description = json.items[0].volumeInfo.description;
                let imageLinks = json.items[0].volumeInfo.imageLinks;

                if (description && imageLinks) {
                    descriptionsId.push(id);
                }
            }
            else if (type == "id") {
                let description = json.volumeInfo.description;
                let imageLinks = json.volumeInfo.imageLinks;
                if (description && imageLinks) {
                    descriptionsId.push(id);
                }
            }
        }
        const loadData = async () => {
            let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${input}&maxResults=10`,
                { method: "GET" });
            response = (response.status === 200) ? await response.json() : null;

            let ids = response?.items?.map((element) => {
                if (element.volumeInfo.industryIdentifiers) {
                    if (element.volumeInfo.industryIdentifiers[0] && element.volumeInfo.industryIdentifiers[0].type.includes("ISBN")) {
                        return element.volumeInfo.industryIdentifiers[0].identifier;
                    }
                    else if (element.volumeInfo.industryIdentifiers[1] && element.volumeInfo.industryIdentifiers[1].type.includes("ISBN")) {
                        return element.volumeInfo.industryIdentifiers[1].identifier;
                    }
                }

                return element.id;
            });

            for (let i = 0; i < ids.length; i++) {
                await checkIfDescription(ids[i]);
            }

            setIsbns(descriptionsId.map((element) => {
                return {
                    element: element
                }
            }))

            setIsInputSet(true);
            setLoadingState(consts.loadingStates.SUCCESS);
        }

        loadData();
        setHeader(input);
    }

    return (
        <>
            {loadingState == consts.loadingStates.LOADING && <View style={styles.loader}><Loader /></View>}
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
                                        setIsInputSet(false);
                                        setLoadingState(consts.loadingStates.INITIAL);
                                        setHeader("Popular Books");
                                    }}
                                    style={[styles.icon, styles.clearIcon]}
                                    name={"close-outline"}
                                ></Ionicons>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
                {(loadingState == consts.loadingStates.SUCCESS || loadingState == consts.loadingStates.INITIAL) &&
                    <BookResult text={header} data={isInputSet ? isbns : popularISBNS}></BookResult>
                }
            </View>
        </>
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
    },
    loader: {
        position: 'absolute',
        width: "100%",
        height: "100%",
    }
});

export default HomeScreen;
